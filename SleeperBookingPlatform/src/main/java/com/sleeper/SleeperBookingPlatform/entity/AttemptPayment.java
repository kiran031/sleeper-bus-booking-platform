package com.sleeper.SleeperBookingPlatform.entity;

import java.time.LocalDateTime;

import com.sleeper.SleeperBookingPlatform.enms.PaymentAttemptStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment_attempts")
@Getter
@Setter
@NoArgsConstructor

public class AttemptPayment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long attemptId;
	
	@ManyToOne(fetch = FetchType.LAZY,optional = false)
	@JoinColumn(name = "payment_id", nullable = false)
	private Payment payment;
	
	@Column(name = "razorpay_payment_id", unique = true, length = 100)
	private String razorpayPaymentId;
	
    @Column(name = "razorpay_signature", length = 512)
    private String razorpaySignature;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 20)
    private PaymentAttemptStatus paymentAttemptStatus = PaymentAttemptStatus.PENDING;
    
    @Column(name = "failure_reason", length = 500)
    private String failureReason;
    
    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
		LocalDateTime now = LocalDateTime.now();
		createdAt = now;
		updatedAt = now;
	}
    
    @PreUpdate
    protected void onUpdate() {
    	LocalDateTime now = LocalDateTime.now();
		updatedAt = now;
    }
}
