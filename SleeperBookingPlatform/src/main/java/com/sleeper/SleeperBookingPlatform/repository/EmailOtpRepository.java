package com.sleeper.SleeperBookingPlatform.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sleeper.SleeperBookingPlatform.entity.EmailOtpVerification;

public interface EmailOtpRepository extends JpaRepository<EmailOtpVerification, Long> {

	Optional<EmailOtpVerification> findByEmail(String email);
}  
