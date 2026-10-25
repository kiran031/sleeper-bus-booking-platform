package com.sleeper.SleeperBookingPlatform.config;

import java.math.BigDecimal;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "booking.pricing")
public class BookingPricingProperties {

    private BigDecimal gstRate = new BigDecimal("0.05");

    private BigDecimal convenienceFee = new BigDecimal("20.00");
}
