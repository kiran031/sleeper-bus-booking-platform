package com.sleeper.SleeperBookingPlatform.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.sleeper.SleeperBookingPlatform.dto.ApiResponse;
import com.sleeper.SleeperBookingPlatform.dto.AuthResponse;
import com.sleeper.SleeperBookingPlatform.service.TokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/token")
@AllArgsConstructor
public class TokenController {

	private final TokenService tokenService;
    
	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<String>> validateTokens(HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse) {

		try {

			AuthResponse authResponse = tokenService.validateToken(httpServletRequest, httpServletResponse);

			ResponseCookie accessCookie = ResponseCookie.from("accessToken", authResponse.getAccessToken())
					.httpOnly(true).secure(false).path("/").maxAge(3600).sameSite("Lax").build();

			ApiResponse<String> apiResponse = new ApiResponse<>(HttpStatus.OK.value(),
					"Access token refreshed successfully", "Success");

			return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, accessCookie.toString())
					.body(apiResponse);
			
		} catch (ResponseStatusException ex) {
			throw ex;
		}

	}

}
