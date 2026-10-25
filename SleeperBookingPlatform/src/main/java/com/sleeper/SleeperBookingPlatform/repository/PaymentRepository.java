package com.sleeper.SleeperBookingPlatform.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sleeper.SleeperBookingPlatform.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	
	Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
	
	Optional<Payment> findFirstByBooking_BookingIdOrderByCreatedAtDesc(
	        Long bookingId
	);
}
