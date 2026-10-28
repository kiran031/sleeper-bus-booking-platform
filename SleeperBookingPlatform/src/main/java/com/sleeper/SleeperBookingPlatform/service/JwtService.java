package com.sleeper.SleeperBookingPlatform.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

	private JwtEncoder accessTokenEncoder;
	private JwtEncoder refreshTokenEncoder;
	
	public JwtService(
	        @Qualifier("accessJwtEncoder") JwtEncoder accessTokenEncoder,
	        @Qualifier("refreshJwtEncoder") JwtEncoder refreshTokenEncoder) {

	    this.accessTokenEncoder = accessTokenEncoder;
	    this.refreshTokenEncoder = refreshTokenEncoder;
	}
	
	
	
	public String generateAccessToken(Long userId) {

		Instant now = Instant.now();

		JwtClaimsSet claims = JwtClaimsSet.builder()
				.subject(userId.toString()).issuedAt(now)
				.expiresAt(now.plusSeconds(900)).build();

		return accessTokenEncoder.encode(JwtEncoderParameters.from(claims))
				.getTokenValue();
	}
	
	public String generateRefershToken(Long userId) {
		
		Instant now = Instant.now();
		
		JwtClaimsSet claims = JwtClaimsSet.builder()
				              .subject(userId.toString())
				              .issuedAt(now)
				              .expiresAt(now.plusSeconds(24*7*3600))
				              .build();
		
		return refreshTokenEncoder.encode(JwtEncoderParameters.from(claims))
				.getTokenValue();
	}
}

