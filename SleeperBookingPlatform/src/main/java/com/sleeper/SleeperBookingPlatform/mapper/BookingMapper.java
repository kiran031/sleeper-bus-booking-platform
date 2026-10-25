package com.sleeper.SleeperBookingPlatform.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.sleeper.SleeperBookingPlatform.dto.BookingRequest;
import com.sleeper.SleeperBookingPlatform.dto.BookingResponse;
import com.sleeper.SleeperBookingPlatform.dto.FareBreakdownResponse;
import com.sleeper.SleeperBookingPlatform.dto.PassengerResponse;
import com.sleeper.SleeperBookingPlatform.entity.Booking;
import com.sleeper.SleeperBookingPlatform.entity.BookingPassanger;
import com.sleeper.SleeperBookingPlatform.entity.Schedule;
import com.sleeper.SleeperBookingPlatform.entity.User;

@Component
public class BookingMapper {


	public Booking toBooking(BookingRequest bookingRequest,User user,Schedule schedule) {
	    Booking booking = new Booking();
		booking.setTravellingDate(bookingRequest.getTravellingDate());
		booking.setBookingPassanger(bookingRequest.getPassengers());
		booking.setUser(user);
		booking.setSchedule(schedule);
		List<BookingPassanger> passengers = new ArrayList<>();
		for(BookingPassanger existingPassanger:bookingRequest.getPassengers()) {
			BookingPassanger passenger = new  BookingPassanger();
			passenger.setPassengerName(existingPassanger.getPassengerName());
			passenger.setAge(existingPassanger.getAge());
			passenger.setGender(existingPassanger.getGender());
			passenger.setSeatNumber(existingPassanger.getSeatNumber());
			passenger.setBookingSeat(booking);
			passengers.add(passenger);
		}
		booking.setBookingPassanger(passengers);
		return booking;
	}


	public BookingResponse toResponse(Booking booking) {
		FareBreakdownResponse fareBreakdownResponse = new FareBreakdownResponse();
		 List<PassengerResponse> passengers =
			        booking.getBookingPassanger()
			            .stream()
			            .map(passenger -> new PassengerResponse(
			                passenger.getPassengerId(),
			                passenger.getPassengerName(),
			                passenger.getAge(),
			                passenger.getGender(),
			                passenger.getSeatNumber()
			            ))
			            .toList();
		return new BookingResponse(booking.getBookingId(),booking.getUser().getId(), booking.getSchedule().getScheduleId(),booking.getTravellingDate(), passengers,"success",fareBreakdownResponse.getTotalAmount(),"done");
	}
}
