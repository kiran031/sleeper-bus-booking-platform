package com.sleeper.SleeperBookingPlatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sleeper.SleeperBookingPlatform.entity.Bus;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

}
