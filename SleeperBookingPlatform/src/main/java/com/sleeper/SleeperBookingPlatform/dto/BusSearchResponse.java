package com.sleeper.SleeperBookingPlatform.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusSearchResponse {

	private Long busId;

	private String busNumber;

	private String busName;

	private String busType;

	private int totalSleepers;

	private String source;

	private String destination;

	private int distance;

	private LocalTime departureTime;

	private LocalDate departureDate;

	private LocalTime arrivalTime;

	private LocalDate arrivalDate;

	private int fare;

	private Long scheduleId;
}
