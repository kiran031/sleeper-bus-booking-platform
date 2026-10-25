package com.sleeper.SleeperBookingPlatform.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sleeper.SleeperBookingPlatform.dto.BusLayoutResponse;
import com.sleeper.SleeperBookingPlatform.dto.BusSearchResponse;
import com.sleeper.SleeperBookingPlatform.dto.LayoutItemResponse;
import com.sleeper.SleeperBookingPlatform.entity.Bus;
import com.sleeper.SleeperBookingPlatform.entity.BusLayoutItem;
import com.sleeper.SleeperBookingPlatform.entity.Schedule;
import com.sleeper.SleeperBookingPlatform.mapper.BusMapper;
import com.sleeper.SleeperBookingPlatform.repository.BusRepository;
import com.sleeper.SleeperBookingPlatform.repository.ScheduleRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BusService {

	private final ScheduleRepository scheduleRepository;

	private final BusMapper busMapper;

	private BusRepository busRepository;

	public List<BusSearchResponse> findBuses(String source, String destination, LocalDate departureDate) {

		List<Schedule> schedules = scheduleRepository.searchBuses(source, destination, departureDate);

		List<BusSearchResponse> busSearchResponse = new ArrayList<>();

		for (Schedule schedule : schedules) {
			busSearchResponse.add(busMapper.toResponse(schedule));
		}

		return busSearchResponse;

	}

	@Transactional(readOnly=true)
	public BusLayoutResponse searchBusLayout(Long busId) {

		Optional<Bus> bus = busRepository.findById(busId);

		if (bus.isEmpty()) {
			return null;
		}

		Bus foundBus = bus.get();

		BusLayoutResponse busLayoutResponse = new BusLayoutResponse(foundBus.getBusId(),
				foundBus.getBusLayout().getLayoutName(), new ArrayList<>());

		List<BusLayoutItem> busLayoutItems = foundBus.getBusLayout().getLayoutItems();

		for (BusLayoutItem busLayoutItem : busLayoutItems) {
			LayoutItemResponse layoutItemResponse = new LayoutItemResponse(busLayoutItem.getPositionCode(),
					busLayoutItem.getItemType(), busLayoutItem.getDeckLevel(), busLayoutItem.getRowNumber(),
					busLayoutItem.getColumnNumber(),busLayoutItem.getColumnSpan());
			busLayoutResponse.getLayoutItems().add(layoutItemResponse);
		}

		return busLayoutResponse;
	}
}
