package com.sleeper.SleeperBookingPlatform.dto;

import java.time.LocalDate;
import java.util.List;

import com.sleeper.SleeperBookingPlatform.entity.BookingPassanger;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class BookingRequest {

	private LocalDate travellingDate;

	private Long scheduleId;

	private List<BookingPassanger> passengers;

}
