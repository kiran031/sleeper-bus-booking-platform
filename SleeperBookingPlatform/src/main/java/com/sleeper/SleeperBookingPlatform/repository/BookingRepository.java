package com.sleeper.SleeperBookingPlatform.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sleeper.SleeperBookingPlatform.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	List<Booking> findBySchedule_ScheduleId(Long Id);
}
