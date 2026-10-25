package com.sleeper.SleeperBookingPlatform.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sleeper.SleeperBookingPlatform.config.BookingPricingProperties;
import com.sleeper.SleeperBookingPlatform.dto.BookingRequest;
import com.sleeper.SleeperBookingPlatform.dto.BookingResponse;
import com.sleeper.SleeperBookingPlatform.dto.FareBreakdownResponse;
import com.sleeper.SleeperBookingPlatform.dto.FareQuoteRequest;
import com.sleeper.SleeperBookingPlatform.entity.Booking;
import com.sleeper.SleeperBookingPlatform.entity.BookingPassanger;
import com.sleeper.SleeperBookingPlatform.entity.Bus;
import com.sleeper.SleeperBookingPlatform.entity.BusLayout;
import com.sleeper.SleeperBookingPlatform.entity.BusLayoutItem;
import com.sleeper.SleeperBookingPlatform.entity.Schedule;
import com.sleeper.SleeperBookingPlatform.entity.User;
import com.sleeper.SleeperBookingPlatform.mapper.BookingMapper;
import com.sleeper.SleeperBookingPlatform.repository.BookingRepository;
import com.sleeper.SleeperBookingPlatform.repository.ScheduleRepository;
import com.sleeper.SleeperBookingPlatform.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BookingService {

	private BookingRepository bookingRepository;

	private ScheduleRepository scheduleRepository;

	private UserRepository userRepository;

	private BookingMapper bookingMapper;

	private BookingPricingProperties bookingPricingProperties;


	@Transactional
	public BookingResponse saveBooking(BookingRequest bookingRequest) {

		if(!isSeatAvailable(bookingRequest)) {
			throw new IllegalArgumentException("Something went worng,Please try again");
		}
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId = authentication.getName();
		Long id = Long.valueOf(userId);
		User user = userRepository.findById(id).orElseThrow(()->new IllegalArgumentException("No user found"));
		Schedule schedule = scheduleRepository.findById(bookingRequest.getScheduleId()).orElseThrow(()->new IllegalArgumentException("No schedule found"));
		Booking booking = bookingMapper.toBooking(bookingRequest,user,schedule);
		Booking savedBooking = bookingRepository.save(booking);
		return bookingMapper.toResponse(savedBooking);
	}



	@Transactional(readOnly = true)
	public boolean isSeatAvailable(BookingRequest bookingRequest) {

		//collect requested seats
		Schedule schedule = scheduleRepository.findById(bookingRequest.getScheduleId())
				.orElseThrow(() -> new IllegalArgumentException("Schedule not found"));

		if (bookingRequest.getPassengers() == null || bookingRequest.getPassengers().isEmpty()) {
			throw new IllegalArgumentException("No passenger provided");
		}


		Bus bus = schedule.getBus();

		if(bus==null) {
			throw new IllegalArgumentException("No bus found");
		}

		BusLayout busLayout = bus.getBusLayout();

		if(busLayout==null||busLayout.getLayoutItems()==null||busLayout.getLayoutItems().isEmpty()) {
			throw new IllegalArgumentException("No bus Layout or Items");
		}

		List<String> layoutSeats = new ArrayList<>();

		List<BusLayoutItem> busLayoutItems = busLayout.getLayoutItems();

		for(BusLayoutItem busLayoutItem:busLayoutItems) {
			String positionCode = busLayoutItem.getPositionCode();

			if (positionCode != null && !positionCode.isBlank()) {
			    layoutSeats.add(positionCode.trim().toUpperCase(Locale.ROOT));
			}
		}


		Set<String> requestedSeats = new HashSet<>();


		for (BookingPassanger passenger : bookingRequest.getPassengers()) {

			String seatNumber = passenger.getSeatNumber();


			if (seatNumber == null || seatNumber.isBlank()) {
				throw new IllegalArgumentException("Seat number is required");
			}

			seatNumber = seatNumber.trim().toUpperCase(Locale.ROOT);

			if(!layoutSeats.contains(seatNumber)) {
				return false;
			}

			if (!requestedSeats.add(seatNumber)) {
				throw new IllegalArgumentException("The same seat was selected more than once: " + seatNumber);
			}
		}

		//verify with already booked seats seat
		List<Booking> existingBookings = bookingRepository.findBySchedule_ScheduleId(bookingRequest.getScheduleId());

		for(Booking existingBooking:existingBookings) {
			 for(BookingPassanger passenger:existingBooking.getBookingPassanger()) {
				 String bookedSeat = passenger.getSeatNumber();
				 if(bookedSeat!=null&&requestedSeats.contains(bookedSeat.trim().toUpperCase(Locale.ROOT))) {
					 return false;
				 }
			 }
		}

		return true;

	}

	@Transactional(readOnly = true)
	public FareBreakdownResponse calculateFareQuote(
	        FareQuoteRequest request) {

	    if (request.getSeatNumbers() == null
	            || request.getSeatNumbers().isEmpty()) {
	        throw new IllegalArgumentException(
	                "At least one seat is required");
	    }

	    Schedule schedule = scheduleRepository
	            .findById(request.getScheduleId())
	            .orElseThrow(() ->
	                    new IllegalArgumentException(
	                            "Schedule not found"));

	    Set<String> seats = new LinkedHashSet<>();

	    for (String seat : request.getSeatNumbers()) {
	        if (seat == null || seat.isBlank()) {
	            throw new IllegalArgumentException(
	                    "Seat number is required");
	        }

	        String normalizedSeat =
	                seat.trim().toUpperCase(Locale.ROOT);

	        if (!seats.add(normalizedSeat)) {
	            throw new IllegalArgumentException(
	                    "Duplicate seat: " + normalizedSeat);
	        }
	    }

	    BigDecimal farePerSeat = BigDecimal.valueOf(schedule.getFare());

	    if (farePerSeat == null || farePerSeat.signum() < 0) {
	        throw new IllegalArgumentException(
	                "Invalid schedule fare");
	    }

	    BigDecimal gstRate =
	            bookingPricingProperties.getGstRate();

	    BigDecimal convenienceFee =
	            bookingPricingProperties.getConvenienceFee();

	    BigDecimal  baseFare = farePerSeat.multiply(BigDecimal.valueOf(seats.size()))
	                .setScale(2, RoundingMode.HALF_UP);

	    BigDecimal gstAmount = baseFare.multiply(gstRate)
	    		               .setScale(2,RoundingMode.HALF_UP);

	    BigDecimal totalAmount = baseFare
	            .add(gstAmount)
	            .add(convenienceFee)
	            .setScale(2, RoundingMode.HALF_UP);


	    return new FareBreakdownResponse(
	            farePerSeat,
	            seats.size(),
	            baseFare,
	            gstRate.multiply(new BigDecimal("100"))
	                   .setScale(2, RoundingMode.HALF_UP),
	            gstAmount,
	            convenienceFee,
	            totalAmount
	    );


	}


}
