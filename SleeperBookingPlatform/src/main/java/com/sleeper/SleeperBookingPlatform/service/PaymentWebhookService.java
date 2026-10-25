package com.sleeper.SleeperBookingPlatform.service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sleeper.SleeperBookingPlatform.enms.BookingStatus;
import com.sleeper.SleeperBookingPlatform.enms.PaymentAttemptStatus;
import com.sleeper.SleeperBookingPlatform.enms.PaymentStatus;
import com.sleeper.SleeperBookingPlatform.entity.AttemptPayment;
import com.sleeper.SleeperBookingPlatform.entity.Payment;
import com.sleeper.SleeperBookingPlatform.repository.BookingRepository;
import com.sleeper.SleeperBookingPlatform.repository.PaymentAttemptRepository;
import com.sleeper.SleeperBookingPlatform.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentWebhookService {

    private final PaymentRepository paymentRepository;
    private final PaymentAttemptRepository paymentAttemptRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public void processEvent(String rawPayload) {

        JSONObject eventJson = new JSONObject(rawPayload);

        String event = eventJson.getString("event");

        // Process only the events we currently support
        if (!event.equals("payment.captured")
                && !event.equals("payment.failed")) {
            return;
        }

        JSONObject paymentEntity = eventJson
                .getJSONObject("payload")
                .getJSONObject("payment")
                .getJSONObject("entity");

        String paymentId = paymentEntity.getString("id");
        String orderId = paymentEntity.getString("order_id");
        String razorpayStatus = paymentEntity.getString("status");
        String currency = paymentEntity.getString("currency");

        long amountInPaise = paymentEntity
                .getLong("amount");

        // Find the exact payment order in our database
        Payment payment = paymentRepository
                .findByRazorpayOrderId(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Payment order not found: " + orderId
                        ));

        long expectedAmountInPaise = payment.getAmount()
                .movePointRight(2)
                .longValueExact();

        // Verify the event's payment details match our record
        if (amountInPaise != expectedAmountInPaise
                || !currency.equals(payment.getCurrency())
                || !"INR".equals(currency)) {

            throw new IllegalArgumentException(
                    "Webhook payment amount or currency mismatch"
            );
        }

        // Find the attempt, or create one for this payment ID
        AttemptPayment attempt = paymentAttemptRepository
                .findByRazorpayPaymentId(paymentId)
                .orElse(null);

        if (attempt == null) {
            attempt = new AttemptPayment();
        } else {
            // Never allow an event to associate this payment ID
            // with a different database Payment record.
            if (attempt.getPayment() == null
                    || !attempt.getPayment().getPaymentId()
                            .equals(payment.getPaymentId())) {

                throw new IllegalArgumentException(
                        "Payment attempt belongs to another payment"
                );
            }

            // A delayed failure event must not downgrade success.
            if (attempt.getPaymentAttemptStatus()
                    == PaymentAttemptStatus.SUCCESS) {
                return;
            }
        }

        attempt.setPayment(payment);
        attempt.setRazorpayPaymentId(paymentId);

        if (event.equals("payment.captured")) {

            if (!"captured".equals(razorpayStatus)) {
                throw new IllegalArgumentException(
                        "Captured event has an unexpected payment status"
                );
            }

            attempt.setPaymentAttemptStatus(
                    PaymentAttemptStatus.SUCCESS
            );
            attempt.setFailureReason(null);

            payment.setStatus(PaymentStatus.SUCCESS);
            payment.getBooking().setStatus(
                    BookingStatus.CONFIRMED
            );

            bookingRepository.save(payment.getBooking());

        } else if (event.equals("payment.failed")) {

            if (!"failed".equals(razorpayStatus)) {
                throw new IllegalArgumentException(
                        "Failed event has an unexpected payment status"
                );
            }

            attempt.setPaymentAttemptStatus(
                    PaymentAttemptStatus.FAILED
            );

            String failureReason =
                    paymentEntity.optString(
                            "error_description",
                            "Payment failed"
                    );

            attempt.setFailureReason(failureReason);

            // Mark this Payment/order as failed so a retry can
            // create a new payment order. Leave the booking
            // pending payment if it is still awaiting payment.
            if (payment.getStatus() != PaymentStatus.SUCCESS) {
                payment.setStatus(PaymentStatus.FAILED);
            }
        }

        paymentAttemptRepository.save(attempt);
        paymentRepository.save(payment);
    }
}
