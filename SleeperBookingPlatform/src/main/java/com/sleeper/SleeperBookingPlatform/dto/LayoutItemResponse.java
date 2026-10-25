package com.sleeper.SleeperBookingPlatform.dto;

import com.sleeper.SleeperBookingPlatform.enms.DeckLevel;
import com.sleeper.SleeperBookingPlatform.enms.LayoutItemType;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LayoutItemResponse {

	private String positionCode;

	private LayoutItemType itemType;

	private DeckLevel deckLevel;

	private int rowNumber;

	private int columnNumber;

	private int columnSpan;
}
