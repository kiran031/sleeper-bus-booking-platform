package com.sleeper.SleeperBookingPlatform.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sleeper.SleeperBookingPlatform.dto.ApiResponse;
import com.sleeper.SleeperBookingPlatform.dto.RouteCityResponse;
import com.sleeper.SleeperBookingPlatform.dto.RouteMatchResponse;
import com.sleeper.SleeperBookingPlatform.service.RouteService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/routes")
@AllArgsConstructor
public class RouteController {

	private final RouteService routeService;

	@GetMapping("/cities")
	public ResponseEntity<ApiResponse<RouteCityResponse>> searchCities(@RequestParam String city){

		RouteCityResponse routeCityResponse = routeService.searchCities(city);

		String message = routeCityResponse.getCities().isEmpty()?"No cities found":"Cities are found";

		ApiResponse<RouteCityResponse> apiResponse = new ApiResponse<>(HttpStatus.OK.value(),message,routeCityResponse);

		return ResponseEntity
				.status(HttpStatus.OK)
				.body(apiResponse);
	}

	@GetMapping("/ways")
	public ResponseEntity<ApiResponse<List<RouteMatchResponse>>> searchSourceAndDestinationRoute(@RequestParam String source,String destination){

		List<RouteMatchResponse> routeMatchResponses = routeService.searchSoureAndDestinationRoute(source, destination);

		String message = routeMatchResponses.isEmpty()? "No matching routes found":"Matching routes are found";

		ApiResponse<List<RouteMatchResponse>> apiReponse = new ApiResponse<>(HttpStatus.OK.value(),message,routeMatchResponses);

		return ResponseEntity
				.status(HttpStatus.OK)
				.body(apiReponse);
	}

}
