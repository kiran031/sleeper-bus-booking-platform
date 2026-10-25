package com.sleeper.SleeperBookingPlatform.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.RazorpayException;
import com.sleeper.SleeperBookingPlatform.dto.ApiResponse;
import com.sleeper.SleeperBookingPlatform.dto.PaymentOrderResponse;
import com.sleeper.SleeperBookingPlatform.entity.User;
import com.sleeper.SleeperBookingPlatform.repository.UserRepository;
import com.sleeper.SleeperBookingPlatform.service.PaymentService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/payments")
@AllArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;
	private final UserRepository userRepository;

	@PostMapping("/orders")
	public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrder(@RequestParam("bookingId") Long bookingId,Authentication authentication) throws RazorpayException {

		Long userId = Long.valueOf(authentication.getName());
		System.out.println(userId);
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
		
	    PaymentOrderResponse paymentOrderResponse =
	            paymentService.createOrder(bookingId, user.getId());

		ApiResponse<PaymentOrderResponse> apiResponse = new ApiResponse<>(HttpStatus.OK.value(),
				"Created Order Successfully", paymentOrderResponse);
		return ResponseEntity.status(HttpStatus.OK).body(apiResponse);

	} 
	
	@PostMapping("/verify")
	public ResponseEntity<?> verifyPayment(
	        @RequestParam String paymentId,
	        @RequestParam String orderId,
	        @RequestParam String signature,Authentication authentication) throws Exception {
		
		Long userId = Long.valueOf(authentication.getName());
		System.out.println(userId);
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

	    // Next: implement signature verification
		paymentService.verifyPayment(paymentId,orderId,signature,user.getId());
	    return ResponseEntity.ok("Payment details received");
	}

}
