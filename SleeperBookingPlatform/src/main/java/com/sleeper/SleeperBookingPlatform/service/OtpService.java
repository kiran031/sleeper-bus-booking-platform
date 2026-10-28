package com.sleeper.SleeperBookingPlatform.service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sleeper.SleeperBookingPlatform.enms.EmailVerificationStatus;
import com.sleeper.SleeperBookingPlatform.entity.EmailOtpVerification;
import com.sleeper.SleeperBookingPlatform.repository.EmailOtpRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpService {
	
	private final EmailOtpRepository emailOtpRepository;
	private final JavaMailSender javaMailSender;
	private final PasswordEncoder passwordEncoder;
	
	private SecureRandom random = new SecureRandom();
	
	public String generateOtp() {
		
		System.nanoTime();
		
		int otp = 1000+random.nextInt(8999);
		
		System.nanoTime();
		
		return String.valueOf(otp);
	}
	
	
	
	
	public void sendOtpTOEmail(String email) {
		
		String otp = generateOtp();
	    Instant expireTime = Instant.now().plusSeconds(120);

	    Optional<EmailOtpVerification> existing =
	            emailOtpRepository.findByEmail(email);
	    

	    EmailOtpVerification record;

	    if (existing.isPresent()) {
	        record = existing.get();
	    } else {
	        record = new EmailOtpVerification();
	        record.setEmail(email);
	    }
	    
	    if(record.getStatus().equals(EmailVerificationStatus.VERIFIED)) {
	    	throw new IllegalArgumentException("Email is already verified");
	    }
	    
	    
	    if(record.getExpireTime()!=null&&Instant.now().isBefore(record.getExpireTime())) {
	    	Long remainingSeconds = Duration.between(Instant.now(),record.getExpireTime()).toSeconds();
	    	throw new IllegalArgumentException(
	                "Request a new OTP after " + remainingSeconds + " seconds"
	            );

	    }

	    record.setOtp(passwordEncoder.encode(otp));
	    record.setExpireTime(expireTime);
        
	    long start = System.nanoTime();
	    emailOtpRepository.save(record);
	    long end = System.nanoTime();
	    
	    System.out.println(
	    	    "OTP database save took: " +
	    	    (end - start) / 1_000_000 + " ms"
	    	);


	    SimpleMailMessage message = new SimpleMailMessage();
	    message.setTo(email);
	    message.setSubject("Sleeper Bus Booking - Email Verification");
	    message.setText(
	        "Your OTP for email verification is: " + otp
	        + "\nThis OTP expires in 2 minutes."
	    );
	    
	    long start1 = System.nanoTime();
	    
	    try {
	    	javaMailSender.send(message);
	    }catch(MailException e) {
	    	throw new IllegalStateException("Unable to send OTP email", e);
	    }
	    
	    long end1 = System.nanoTime();
	    
	    System.out.println(
	    	    "Email sending took: " +
	    	    (end1- start1) / 1_000_000 + " ms"
	    	);

	    
	}

	public boolean verifyOtp(String email,String otp) {
		
		
		Instant now = Instant.now();
		
		EmailOtpVerification existing = emailOtpRepository.findByEmail(email).orElseThrow(()->new IllegalArgumentException("No stored otp"));
		
		
	    // Reject an OTP that was already verified.
	    if (existing.getStatus() == EmailVerificationStatus.VERIFIED) {
	        return false;
	    }

		
		if(!passwordEncoder.matches(otp,existing.getOtp()) || !now.isBefore(existing.getExpireTime()))
			return false;
		
		
		existing.setStatus(EmailVerificationStatus.VERIFIED);
	    emailOtpRepository.save(existing);
	    

		
		return true;
		
	}

}
