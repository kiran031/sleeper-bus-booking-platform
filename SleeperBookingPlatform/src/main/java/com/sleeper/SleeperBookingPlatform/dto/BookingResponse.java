package com.sleeper.SleeperBookingPlatform.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class BookingResponse {

	private Long bookingId;

	private Long userId;

	private Long scheduleId;

	private LocalDate travellingDate;

	private List<PassengerResponse> passanger;

	private String status;

	private BigDecimal totalAmont;

	private String message;

}
