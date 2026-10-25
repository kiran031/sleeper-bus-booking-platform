package com.sleeper.SleeperBookingPlatform.mapper;

import org.springframework.stereotype.Component;

import com.sleeper.SleeperBookingPlatform.dto.BusSearchResponse;
import com.sleeper.SleeperBookingPlatform.entity.Schedule;

@Component
public class BusMapper {

	public BusSearchResponse toResponse(Schedule bus) {

		return new BusSearchResponse(bus.getBus().getBusId(), bus.getBus().getBusNumber(), bus.getBus().getBusName(),
				bus.getBus().getBusType(), bus.getBus().getTotalSleepers(), bus.getRoute().getSource(),
				bus.getRoute().getDestination(), bus.getRoute().getDistance(), bus.getDepartureTime(),
				bus.getDepartureDate(), bus.getArrivalTime(), bus.getArrivalDate(), bus.getFare(),bus.getScheduleId());
	}
}
