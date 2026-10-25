package com.sleeper.SleeperBookingPlatform.config.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.sleeper.SleeperBookingPlatform.entity.User;

public class CustomerUserDetails implements UserDetails {

	private Long userId;

	private String email;

	private String password;

	public CustomerUserDetails(User user) {

		this.userId = user.getId();
		this.email = user.getEmail();
		this.password = user.getPassword();
	}

	public Long getUserId() {
        return userId;
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.emptyList();
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return email;
	}

}
