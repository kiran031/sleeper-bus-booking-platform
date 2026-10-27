package com.sleeper.SleeperBookingPlatform.entity;

import java.time.Instant;

import com.sleeper.SleeperBookingPlatform.enms.EmailVerificationStatus;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class EmailOtpVerification {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(unique = true,nullable = false)
	private String email;
	
	@Column(nullable = false)
	private String otp;
	
	@Column(nullable = false)
	private Instant expireTime;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EmailVerificationStatus status = EmailVerificationStatus.PENDING;

}
