package com.sleeper.SleeperBookingPlatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteMatchResponse {

    private String source;

    private String destination;
}
