package com.sleeper.SleeperBookingPlatform.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sleeper.SleeperBookingPlatform.dto.ApiResponse;
import com.sleeper.SleeperBookingPlatform.service.OtpService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/users/email")
@AllArgsConstructor
public class EmailOtpController {
	
	private final OtpService otpService;
	
	@PostMapping("/otp")
	public ResponseEntity<?> sendOtpTOEmail(@RequestParam String email) {
		
		long start = System.nanoTime();
		
		otpService.sendOtpTOEmail(email);
		
		long end = System.nanoTime();
		
		System.out.println(
			    "Entire Operation took: " +
			    (end - start) / 1_000_000 + " ms"
			);

		
		ApiResponse<?> ApiResponse = new ApiResponse<>(HttpStatus.OK.value(),"Otp sent to email successfully",null);
		
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse);
		
	}
	
	@PostMapping("/otp/verify")
	public ResponseEntity<ApiResponse<Map<String,Boolean>>> verifyOtp(@RequestParam("email") String email,@RequestParam("otp") String otp){
		
		boolean isVerified = otpService.verifyOtp(email, otp);

		if (!isVerified) {
		    ApiResponse<Map<String, Boolean>> response =
		        new ApiResponse<>(
		            HttpStatus.BAD_REQUEST.value(),
		            "Invalid or expired OTP",
		            Map.of("status", false)
		        );

		    return ResponseEntity
		        .status(HttpStatus.BAD_REQUEST)
		        .body(response);
		}
		
		 ApiResponse<Map<String, Boolean>> response =
			        new ApiResponse<>(
			            HttpStatus.OK.value(),
			            "Verified Otp Successfully",
			            Map.of("status", true)
			        );
		 
		 return ResponseEntity
			        .status(HttpStatus.OK)
			        .body(response);
			
	}

}
