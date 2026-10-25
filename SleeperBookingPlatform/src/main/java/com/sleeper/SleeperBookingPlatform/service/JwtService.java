package com.sleeper.SleeperBookingPlatform.service;

import java.time.Instant;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class JwtService {

	private JwtEncoder jwtEncoder;

	public String generateToken(Long userId) {

		Instant now = Instant.now();

		JwtClaimsSet claims = JwtClaimsSet.builder()
				.subject(userId.toString()).issuedAt(now)
				.expiresAt(now.plusSeconds(3600)).build();

		return jwtEncoder.encode(JwtEncoderParameters.from(claims))
				.getTokenValue();
	}
}

