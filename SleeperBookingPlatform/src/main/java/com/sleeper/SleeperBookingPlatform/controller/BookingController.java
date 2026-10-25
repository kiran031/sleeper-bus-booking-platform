package com.sleeper.SleeperBookingPlatform.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sleeper.SleeperBookingPlatform.dto.ApiResponse;
import com.sleeper.SleeperBookingPlatform.dto.BookingRequest;
import com.sleeper.SleeperBookingPlatform.dto.BookingResponse;
import com.sleeper.SleeperBookingPlatform.dto.FareBreakdownResponse;
import com.sleeper.SleeperBookingPlatform.dto.FareQuoteRequest;
import com.sleeper.SleeperBookingPlatform.service.BookingService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/booking")
public class BookingController {

	private BookingService bookingService;

	@PostMapping("/seat")
	public ResponseEntity<ApiResponse<BookingResponse>> bookSeat(@RequestBody BookingRequest bookingRequest){

		BookingResponse bookingResponse = bookingService.saveBooking(bookingRequest);

		ApiResponse<BookingResponse> apiResponse = new ApiResponse<>(HttpStatus.OK.value(),"Booked Successfully",bookingResponse);

		return ResponseEntity
				.status(HttpStatus.OK)
				.body(apiResponse);
	}

	@PostMapping("/fare-quote")
	public ResponseEntity<ApiResponse<FareBreakdownResponse>> calculateFareQuote(
	        @RequestBody FareQuoteRequest request) {

		ApiResponse<FareBreakdownResponse> apiResponse = new ApiResponse<>(HttpStatus.CREATED.value(),"Fare calculated successfully",bookingService.calculateFareQuote(request));
	    return ResponseEntity
	    		.status(HttpStatus.OK)
	    		.body(apiResponse);
	}

}
