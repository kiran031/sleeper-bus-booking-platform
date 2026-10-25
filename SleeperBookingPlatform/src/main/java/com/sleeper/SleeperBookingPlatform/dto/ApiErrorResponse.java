package com.sleeper.SleeperBookingPlatform.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiErrorResponse {
  private int status;

  private String message;

  private Map<String,String> errors;
}
