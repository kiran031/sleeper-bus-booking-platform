package com.sleeper.SleeperBookingPlatform.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sleeper.SleeperBookingPlatform.dto.ApiResponse;
import com.sleeper.SleeperBookingPlatform.dto.AuthResponse;
import com.sleeper.SleeperBookingPlatform.dto.LoginRequest;
import com.sleeper.SleeperBookingPlatform.dto.RegisterUserRequest;
import com.sleeper.SleeperBookingPlatform.dto.UserResponse;
import com.sleeper.SleeperBookingPlatform.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

	private UserService userService;

	@PostMapping("register")
	public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody RegisterUserRequest registerUserRequest){

	     AuthResponse authResponse =  userService.register(registerUserRequest);

	     ResponseCookie responseCookie = ResponseCookie.from(
	    		  "accessToken",
	    		  authResponse.getAccessToken()
	    		 )
	    		 .httpOnly(true)
	    		 .secure(false)
	    		 .path("/")
	    		 .maxAge(3600)
	    		 .sameSite("Lax")
	    		 .build();

		ApiResponse<UserResponse> apiResponse = new ApiResponse<>(HttpStatus.CREATED.value(), "User registered successfully",authResponse.getUserResponse());
		return ResponseEntity.status(HttpStatus.CREATED)
				             .header(HttpHeaders.SET_COOKIE,responseCookie.toString())
				             .body(apiResponse);
	}

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<UserResponse>> login(@Valid @RequestBody LoginRequest loginRequest){

		AuthResponse authResponse = userService.login(loginRequest.getEmail(),loginRequest.getPassword());

		ResponseCookie cookies = ResponseCookie.from(
				   "accessToken",
				   authResponse.getAccessToken()
				)
				.httpOnly(true)
				.secure(false)
				.path("/")
				.maxAge(3600)
				.sameSite("Lax")
				.build();

		ApiResponse<UserResponse> apiResponse = new ApiResponse<>(HttpStatus.OK.value(),"User loggedin successfully",authResponse.getUserResponse());

		return ResponseEntity
				 .status(HttpStatus.OK)
				 .header(HttpHeaders.SET_COOKIE, cookies.toString())
				 .body(apiResponse);

	}

	@GetMapping("profile")
	public void loginUser() {
		System.out.println("Yes, I'am getting profile");
		return;
	}
}
