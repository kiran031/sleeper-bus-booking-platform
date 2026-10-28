package com.sleeper.SleeperBookingPlatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthResponse {

   private UserResponse UserResponse;
   private String accessToken;
   private String refreshToken;
}
