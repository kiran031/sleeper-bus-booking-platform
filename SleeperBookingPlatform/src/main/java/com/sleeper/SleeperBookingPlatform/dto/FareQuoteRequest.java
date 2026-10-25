package com.sleeper.SleeperBookingPlatform.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FareQuoteRequest {
    private Long scheduleId;
    private List<String> seatNumbers;
}
