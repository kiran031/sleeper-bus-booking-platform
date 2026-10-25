package com.sleeper.SleeperBookingPlatform.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.sleeper.SleeperBookingPlatform.enms.BookingStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name = "Book_Seat")
@Entity
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bookingId;

	private LocalDate travellingDate;

	@OneToMany(mappedBy = "bookingSeat",
			cascade = CascadeType.PERSIST
			)
	private List<BookingPassanger> bookingPassanger = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "schedule_id",nullable = false)
	private Schedule schedule;

	@ManyToOne(fetch = FetchType.LAZY,optional = true)
	@JoinColumn(name = "user_id",nullable = false)
	private User user;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "booking_status",nullable = false)
	private BookingStatus status = BookingStatus.PENDING_PAYMENT;
}
