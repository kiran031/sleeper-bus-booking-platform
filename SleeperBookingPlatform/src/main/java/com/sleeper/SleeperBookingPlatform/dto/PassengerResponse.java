package com.sleeper.SleeperBookingPlatform.dto;


import com.sleeper.SleeperBookingPlatform.enms.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PassengerResponse {

    private Long passengerId;
    private String passengerName;
    private int age;
    private Gender gender;
    private String seatNumber;
}
