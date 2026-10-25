package com.sleeper.SleeperBookingPlatform.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusSearchRequest {

	@NotBlank(message = "Source is required")
	private String source;

	@NotBlank(message = "Message is required")
	private String destination;

	@NotNull(message= "Travelling is required")
	private LocalDate departureDate;
}
