package com.sleeper.SleeperBookingPlatform.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sleeper.SleeperBookingPlatform.dto.ApiResponse;
import com.sleeper.SleeperBookingPlatform.dto.BusLayoutResponse;
import com.sleeper.SleeperBookingPlatform.dto.BusSearchResponse;
import com.sleeper.SleeperBookingPlatform.service.BusService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/buses")
@AllArgsConstructor
public class BusController {

	private final BusService busService;

	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<BusSearchResponse>>> searchBuses(@Valid @RequestParam String source, String destination, LocalDate departureDate){

		List<BusSearchResponse> buses = busService.findBuses(source,destination,departureDate);

		String message = buses.isEmpty()? "No bus found" : "Buses are avialable";
		ApiResponse<List<BusSearchResponse>> apiResponse = new ApiResponse<>(HttpStatus.FOUND.value(),message,buses);

		return ResponseEntity
				 .status(HttpStatus.OK)
				 .body(apiResponse);
	}

	@GetMapping("/layout")
	public ResponseEntity<ApiResponse<BusLayoutResponse>> searchBusLayout(@RequestParam Long busId){

        BusLayoutResponse busLayoutResponse = busService.searchBusLayout(busId);

        ApiResponse<BusLayoutResponse> apiResponse = new ApiResponse<>(HttpStatus.OK.value(),"Layout has found",busLayoutResponse);

        return ResponseEntity.
        		status(HttpStatus.OK)
        		.body(apiResponse);
	}
}
