package com.sleeper.SleeperBookingPlatform.mapper;

import org.springframework.stereotype.Component;

import com.sleeper.SleeperBookingPlatform.dto.RegisterUserRequest;
import com.sleeper.SleeperBookingPlatform.dto.UserResponse;
import com.sleeper.SleeperBookingPlatform.entity.User;

@Component
public class UserMapper {

	public User toEntity(RegisterUserRequest request) {
		User user = new User();
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setEmail(request.getEmail());
		user.setNumber(request.getMobile());
		user.setPassword(request.getPassword());
		return user;
	}

	public UserResponse toResponse(User user) {
		return new UserResponse(user.getId(),user.getFirstName(),
				user.getLastName(),user.getEmail(),user.getNumber());
	}


}
