package com.sleeper.SleeperBookingPlatform.config.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
public class JwtTokenValidator {

	private JwtDecoder accessJwtDecoder;
	private JwtDecoder refreshJwtDecoder;
	
	public JwtTokenValidator(@Qualifier("accessJwtDecoder") JwtDecoder accessJwtDecoder,@Qualifier("refreshJwtDecoder") JwtDecoder refreshJwtDecoder){
		
		this.accessJwtDecoder=accessJwtDecoder;
		this.refreshJwtDecoder=refreshJwtDecoder;
	}
	

	public Jwt validateToken(String accesstoken) {
	
		return accessJwtDecoder.decode(accesstoken);
	}
	
	public Jwt validateRefreshToken(String refershToken) {
		
		return  refreshJwtDecoder.decode(refershToken);
	}
}
