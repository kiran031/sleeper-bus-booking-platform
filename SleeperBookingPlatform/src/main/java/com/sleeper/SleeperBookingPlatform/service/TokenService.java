package com.sleeper.SleeperBookingPlatform.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.sleeper.SleeperBookingPlatform.config.service.JwtTokenValidator;
import com.sleeper.SleeperBookingPlatform.dto.AuthResponse;
import com.sleeper.SleeperBookingPlatform.dto.UserResponse;
import com.sleeper.SleeperBookingPlatform.entity.User;
import com.sleeper.SleeperBookingPlatform.mapper.UserMapper;
import com.sleeper.SleeperBookingPlatform.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TokenService {

	private final JwtTokenValidator jwtTokenValidator;
	private final JwtService jwtService;
	private final UserRepository userRepository;
	private final UserMapper userMapper;
	

	public AuthResponse validateToken(HttpServletRequest httpServletRequest,HttpServletResponse httpServletResponse) {

		 Cookie[] cookies = httpServletRequest.getCookies();

		    if (cookies == null) {
		        throw new ResponseStatusException(
		                HttpStatus.UNAUTHORIZED,
		                "Refresh token is missing"
		        );
		    }

		    String refreshTokenValue = null;

		    for (Cookie cookie : cookies) {
		        if ("refreshToken".equals(cookie.getName())) {
		            refreshTokenValue = cookie.getValue();
		            break;
		        }
		    }

		    if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
		        throw new ResponseStatusException(
		                HttpStatus.UNAUTHORIZED,
		                "Refresh token is missing"
		        );
		    }
		    

		    try {
		        Jwt refreshJwt =
		                jwtTokenValidator.validateRefreshToken(refreshTokenValue);

		        Long userId = Long.valueOf(refreshJwt.getSubject());

		        User user = userRepository.findById(userId)
		                .orElseThrow(() -> new ResponseStatusException(
		                        HttpStatus.UNAUTHORIZED,
		                        "User not found"
		                ));

		        String accessToken = jwtService.generateAccessToken(userId);

		        UserResponse userResponse = userMapper.toResponse(user);

		        // Keep the existing refresh token unchanged.
		        return new AuthResponse(
		                userResponse,
		                accessToken,
		                refreshTokenValue
		        );

		    } catch (ResponseStatusException e) {
		        throw e;
		    } catch (Exception e) {
		        throw new ResponseStatusException(
		                HttpStatus.UNAUTHORIZED,
		                "Refresh token is invalid or expired"
		        );
		    }
	}
	
	

}
