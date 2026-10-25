package com.sleeper.SleeperBookingPlatform.entity;

import com.sleeper.SleeperBookingPlatform.enms.Gender;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "passenger")
public class BookingPassanger {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long passengerId;

  private String passengerName;

  private int age;

  @Enumerated(EnumType.STRING)
  private Gender gender;

  private String seatNumber;

  @ManyToOne
  @JoinColumn(name="booking_id",nullable = false)
  private Booking  bookingSeat;

}
