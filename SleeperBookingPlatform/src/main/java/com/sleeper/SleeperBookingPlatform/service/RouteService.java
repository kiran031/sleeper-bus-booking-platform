package com.sleeper.SleeperBookingPlatform.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.sleeper.SleeperBookingPlatform.dto.RouteCityResponse;
import com.sleeper.SleeperBookingPlatform.dto.RouteMatchResponse;
import com.sleeper.SleeperBookingPlatform.repository.RouteRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RouteService {

	private final RouteRepository routeRepository;

	public RouteCityResponse searchCities(String city) {

		List<String> sources = routeRepository.findCitiesBySource(city);

		List<String> destinations = routeRepository.findCitiesByDestination(city);

		Set<String> cities = new LinkedHashSet<>();

		cities.addAll(sources);
		cities.addAll(destinations);

		return new RouteCityResponse(new ArrayList<>(cities));
	}

	public List<RouteMatchResponse> searchSoureAndDestinationRoute(String source,String destination){

		return routeRepository.findRoutesBySourceAndDestination(source.trim(),destination.trim());
	}

}
