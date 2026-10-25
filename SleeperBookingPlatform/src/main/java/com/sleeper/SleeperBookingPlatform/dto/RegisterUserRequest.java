package com.sleeper.SleeperBookingPlatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterUserRequest {

	@NotBlank(message ="First name can not be empty")
	@Size(min=2,max=10,message ="First name must be between 2 and 10 characters")
	@Pattern(regexp = "^[a-zA-z]+$",message ="First name must contain only letters")
	String firstName;

	@NotBlank(message ="Last name can not be empty")
	@Size(min=2,max=10,message ="Last name must be between 2 and 10 characters")
	@Pattern(regexp = "^[a-zA-z]+$",message ="Last name must contain only letters")
	String lastName;

	@NotBlank(message = "Email can not be empty")
	@Pattern(
		    regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$",
		    message = "Please enter a valid Gmail address"
		)
	String email;

	@NotBlank(message = "Mobile number can not be empty")
	@Size(min=10,max=10,message = "Mobile number must be exactly 10 digits")
	@Pattern(regexp = "^[0-9]+$",message ="Mobile number must contain only digits")
	String mobile;

	@NotBlank(message = "Password can not be empty")
	@Pattern(
		    regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$",
		    message = "Password must contain at least one uppercase letter, one lowercase letter, one special character, and 8 characters"
		)

	String password;
	@NotBlank(message = "Confirm Password can not be empty")
	@Pattern(
		    regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$",
		    message = "Password must contain at least one uppercase letter, one lowercase letter, one special character, and 8 characters"
		)
	String confirmPassword;
}
