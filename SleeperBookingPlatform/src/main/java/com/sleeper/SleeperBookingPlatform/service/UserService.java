package com.sleeper.SleeperBookingPlatform.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sleeper.SleeperBookingPlatform.config.service.CustomerUserDetails;
import com.sleeper.SleeperBookingPlatform.dto.AuthResponse;
import com.sleeper.SleeperBookingPlatform.dto.RegisterUserRequest;
import com.sleeper.SleeperBookingPlatform.dto.UserResponse;
import com.sleeper.SleeperBookingPlatform.enms.EmailVerificationStatus;
import com.sleeper.SleeperBookingPlatform.entity.EmailOtpVerification;
import com.sleeper.SleeperBookingPlatform.entity.User;
import com.sleeper.SleeperBookingPlatform.mapper.UserMapper;
import com.sleeper.SleeperBookingPlatform.repository.EmailOtpRepository;
import com.sleeper.SleeperBookingPlatform.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailOtpRepository emailOtpRepository;

	public AuthResponse register(RegisterUserRequest registerUserRequest){
		
		EmailOtpVerification existing = emailOtpRepository.findByEmail(registerUserRequest.getEmail()).orElseThrow(()->new IllegalArgumentException("No User verification exists"));
		
		if(existing.getStatus().equals(EmailVerificationStatus.PENDING)) {
			throw new IllegalArgumentException("User email is not verified");
		}

	    User user = userMapper.toEntity(registerUserRequest);

	    String encodedUserPassword = passwordEncoder.encode(registerUserRequest.getPassword());

	    user.setPassword(encodedUserPassword);
	    

		User savedUser = userRepository.save(user);

		UserResponse userResponse = userMapper.toResponse(savedUser);

		String accessToken = jwtService.generateToken(savedUser.getId());

		AuthResponse authResponse = new AuthResponse(userResponse,accessToken);

		return authResponse;

	}

	public AuthResponse login(String email,String password){

		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
		   = new UsernamePasswordAuthenticationToken(email, password);

		Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);

		CustomerUserDetails customerUserDetails = (CustomerUserDetails)authentication.getPrincipal();

		Long userId = customerUserDetails.getUserId();

		String accessToken = jwtService.generateToken(userId);

		User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));

		UserResponse userResponse = userMapper.toResponse(user);

	    AuthResponse authResponse = new AuthResponse(userResponse,accessToken);

	    return authResponse;

	}
}
