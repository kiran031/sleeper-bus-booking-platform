package com.sleeper.SleeperBookingPlatform.config.service;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class JwtTokenValidator {

	private final JwtDecoder jwtDecoder;

	public Jwt validateToken(String token) {

		return jwtDecoder.decode(token);
	}
}
