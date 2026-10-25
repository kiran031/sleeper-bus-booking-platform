package com.sleeper.SleeperBookingPlatform.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FareBreakdownResponse {

    private BigDecimal farePerSeat;
    private int seatCount;
    private BigDecimal baseFare;
    private BigDecimal gstRatePercent;
    private BigDecimal gstAmount;
    private BigDecimal convenienceFee;
    private BigDecimal totalAmount;
}
