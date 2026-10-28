package com.sleeper.SleeperBookingPlatform.config.filter;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sleeper.SleeperBookingPlatform.config.service.JwtTokenValidator;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenValidator jwtTokenValidator;
	


	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		Cookie[] cookies = request.getCookies();

		if (cookies != null) {

			for (Cookie cookie : cookies) {

				if ("accessToken".equals(cookie.getName())) {

					String accessToken = cookie.getValue();

					try {
						Jwt accessJwt = jwtTokenValidator.validateToken(accessToken);
						JwtAuthenticationToken authentication = new JwtAuthenticationToken(accessJwt,
								Collections.emptyList());
						SecurityContextHolder.getContext().setAuthentication(authentication);
					} catch (Exception e) {
								response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
								return;
						}
					}
				}
			}

//		String header = request.getHeader("Authorization");

//		if (header != null && header.startsWith("Bearer ")) {
//
//			String token = header.substring(7);
//			try {
//				Jwt jwt = jwtTokenValidator.validateToken(token);
//				JwtAuthenticationToken authentication = new JwtAuthenticationToken(jwt,Collections.emptyList());
//				SecurityContextHolder.getContext().setAuthentication(authentication);
//			} catch (Exception e) {
//				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//				return ;
//			}
//		}

		filterChain.doFilter(request, response);
	}


}
