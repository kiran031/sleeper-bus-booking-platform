package com.sleeper.SleeperBookingPlatform.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.sleeper.SleeperBookingPlatform.dto.PaymentOrderResponse;
import com.sleeper.SleeperBookingPlatform.enms.BookingStatus;
import com.sleeper.SleeperBookingPlatform.enms.PaymentAttemptStatus;
import com.sleeper.SleeperBookingPlatform.enms.PaymentStatus;
import com.sleeper.SleeperBookingPlatform.entity.AttemptPayment;
import com.sleeper.SleeperBookingPlatform.entity.Booking;
import com.sleeper.SleeperBookingPlatform.entity.Payment;
import com.sleeper.SleeperBookingPlatform.repository.BookingRepository;
import com.sleeper.SleeperBookingPlatform.repository.PaymentAttemptRepository;
import com.sleeper.SleeperBookingPlatform.repository.PaymentRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

	private final RazorpayClient razorpayClient;
	private final BookingRepository bookingRepository;
	private final PaymentRepository paymentRepository;
	private final PaymentAttemptRepository paymentAttemptRepository;

	@Value("${razorpay.key-id}")
	private String keyId;

	@Value("${razorpay.key-secret}")
	private String keySecret;

	@Value("${booking.pricing.gst-rate}")
	private BigDecimal gstRate;

	@Value("${booking.pricing.convenience-fee}")
	private BigDecimal convenienceFee;

	public PaymentOrderResponse createOrder(Long bookingId, Long authenticatedUserId) throws RazorpayException {


		// 1. Find the booking
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

		// 2. Ensure the logged-in user owns this booking
		if (booking.getUser() == null || !authenticatedUserId.equals(booking.getUser().getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can not pay for this booking");
		}

		// 3. Only pending bookings can be paid for
		if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
			System.out.println(booking.getStatus());
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking is not pending payment");
		}

		// 4. Count passengers from the saved booking
		int passengerCount = booking.getBookingPassanger() == null ? 0 : booking.getBookingPassanger().size();

		if (passengerCount == 0 || booking.getSchedule() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking has no passengers or scheduled trip");
		}

		// 5. Calculate the amount on the backend
		BigDecimal farePerSeat = BigDecimal.valueOf(booking.getSchedule().getFare());

		BigDecimal baseFare = farePerSeat.multiply(BigDecimal.valueOf(passengerCount)).setScale(2,
				RoundingMode.HALF_UP);

		BigDecimal gstAmount = baseFare.multiply(gstRate).setScale(2, RoundingMode.HALF_UP);

		BigDecimal totalAmount = baseFare.add(gstAmount).add(convenienceFee).setScale(2, RoundingMode.HALF_UP);

		if (totalAmount.signum() <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment amount must be positive");
		}

		// Razorpay requires the amount in paise
		long amountInPaise = totalAmount.movePointRight(2).longValueExact();

		// 6. Prepare the Razorpay order request
		JSONObject orderRequest = new JSONObject();

		orderRequest.put("amount", amountInPaise);
		orderRequest.put("currency", "INR");
		orderRequest.put("receipt", "booking_" + bookingId + "_" + UUID.randomUUID().toString().substring(0, 8));
		
		Payment existingPayment = paymentRepository
		        .findFirstByBooking_BookingIdOrderByCreatedAtDesc(bookingId)
		        .orElse(null);

		if (existingPayment != null
		        && existingPayment.getStatus() == PaymentStatus.PENDING
		        && existingPayment.getAmount().compareTo(totalAmount) == 0
		        && "INR".equals(existingPayment.getCurrency())
		        && existingPayment.getRazorpayOrderId() != null
		        && !existingPayment.getRazorpayOrderId().isBlank()) {

		    return new PaymentOrderResponse(
		            existingPayment.getPaymentId(),
		            booking.getBookingId(),
		            existingPayment.getRazorpayOrderId(),
		            existingPayment.getAmount()
		                    .movePointRight(2)
		                    .longValueExact(),
		            existingPayment.getCurrency(),
		            keyId
		    );
		}

		// 7. Ask Razorpay to create the order
		Order razorpayOrder = razorpayClient.orders.create(orderRequest);

		String razorpayOrderId = razorpayOrder.get("id").toString();

		// 8. Save our payment record in MySQL
		Payment payment = new Payment();

		payment.setBooking(booking);
		payment.setAmount(totalAmount);
		payment.setCurrency("INR");
		payment.setRazorpayOrderId(razorpayOrderId);
		payment.setStatus(PaymentStatus.PENDING);

		Payment savedPayment = paymentRepository.save(payment);

		// 9. Return the details React needs for Checkout
		return new PaymentOrderResponse(savedPayment.getPaymentId(), booking.getBookingId(), razorpayOrderId,
				amountInPaise, "INR", keyId);

	}

	private boolean verifySignature(
			String paymentId,
	        String orderId,
	        String signature,
	        Long authenticatedUserId
            ) throws Exception {
		
		Payment payment = paymentRepository
	            .findByRazorpayOrderId(orderId)
	            .orElseThrow(() -> new IllegalArgumentException(
	                    "Payment order not found"
	            ));

	    if (payment.getBooking() == null
	            || payment.getBooking().getUser() == null) {
	        throw new IllegalArgumentException(
	                "Booking or associated user not found"
	        );
	    }

	    if (!authenticatedUserId.equals(
	            payment.getBooking().getUser().getId())) {
	        throw new IllegalArgumentException(
	                "You are not authorized to verify this payment"
	        );
	    }

        String payload = payment.getRazorpayOrderId() + "|" + paymentId;

        Mac mac = Mac.getInstance("HmacSHA256");

        SecretKeySpec secretKey = new SecretKeySpec(
                keySecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );

        mac.init(secretKey);

        byte[] hash = mac.doFinal(
                payload.getBytes(StandardCharsets.UTF_8)
        );

        String expectedSignature = HexFormat.of().formatHex(hash);

        boolean isValidSignature = MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8)
        );
        
        if (!isValidSignature) {
            return false;
        }
        String paymentOrderId = orderId;

        if (paymentOrderId == null || paymentOrderId.isBlank()) {
            throw new IllegalArgumentException(
                    "Razorpay order ID is missing"
            );
        }

        // Always fetch the actual payment from Razorpay
        com.razorpay.Payment razorpayPayment =
                razorpayClient.payments.fetch(paymentId);

        String actualOrderId =
                String.valueOf(razorpayPayment.get("order_id"));

        String status =
                String.valueOf(razorpayPayment.get("status"));

        boolean captured =
                Boolean.TRUE.equals(razorpayPayment.get("captured"));

        long amountInPaise =
                ((Number) razorpayPayment.get("amount")).longValue();

        String currency =
                String.valueOf(razorpayPayment.get("currency"));

        long expectedAmountInPaise = payment.getAmount()
                .movePointRight(2)
                .longValueExact();

        // Verify the order ID
        if (!paymentOrderId.equals(actualOrderId)) {
            throw new IllegalArgumentException(
                    "Payment does not belong to this order"
            );
        }

        // Verify the amount and currency
        if (amountInPaise != expectedAmountInPaise
                || !"INR".equals(currency)
                || !"INR".equals(payment.getCurrency())) {
            throw new IllegalArgumentException(
                    "Payment amount or currency mismatch"
            );
        }

        // Only a captured payment is considered successful
        if (!"captured".equals(status) || !captured) {
            throw new IllegalArgumentException(
                    "Payment has not been captured. Razorpay status: " + status
            );
        }

        return true;

	}

	@Transactional
	public void verifyPayment(String paymentId, String orderId, String signature,Long authenticatedUserId) throws Exception {
		Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
				.orElseThrow(() -> new IllegalArgumentException("No payment orderId to verify"));

		boolean valid = verifySignature(paymentId,payment.getRazorpayOrderId(),signature,authenticatedUserId);

		if (!valid) {
			throw new IllegalArgumentException("Invalid payment signature");
		}

		AttemptPayment attemptPayment = paymentAttemptRepository
		        .findByRazorpayPaymentId(paymentId)
		        .orElseGet(null);
		
		if (attemptPayment != null
		        && attemptPayment.getPaymentAttemptStatus()
		                == PaymentAttemptStatus.SUCCESS) {
		    return;
		}

		
		if (attemptPayment == null) {
		    attemptPayment = new AttemptPayment();
		}

		attemptPayment.setPayment(payment);
		attemptPayment.setRazorpayPaymentId(paymentId);
		attemptPayment.setRazorpaySignature(signature);
		attemptPayment.setPaymentAttemptStatus(PaymentAttemptStatus.SUCCESS);
		attemptPayment.setFailureReason(null);

		payment.setStatus(PaymentStatus.SUCCESS);
		payment.getBooking().setStatus(BookingStatus.CONFIRMED);

		paymentAttemptRepository.save(attemptPayment);
		paymentRepository.save(payment);
		bookingRepository.save(payment.getBooking());

	}
}
