package com.sleeper.SleeperBookingPlatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentOrderResponse {
	private Long paymentRecordId;
    private Long bookingId;
    private String orderId;
    private Long amount;
    private String currency;
    private String keyId;

}
