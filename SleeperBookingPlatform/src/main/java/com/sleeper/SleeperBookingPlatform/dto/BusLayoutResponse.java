package com.sleeper.SleeperBookingPlatform.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class BusLayoutResponse {

	private Long busId;

	private String layoutName;

	private List<LayoutItemResponse> layoutItems;
}
