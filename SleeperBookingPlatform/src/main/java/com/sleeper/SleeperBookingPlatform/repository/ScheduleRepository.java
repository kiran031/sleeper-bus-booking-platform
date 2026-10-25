package com.sleeper.SleeperBookingPlatform.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sleeper.SleeperBookingPlatform.entity.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	@Query("""
			 select s
			 from Schedule s
			 join s.route r
			 where r.source = :source
			 and r.destination =:destination
			 and s.departureDate =:departureDate
			""")
	List<Schedule> searchBuses(@Param("source") String source,@Param("destination") String destination
			,@Param("departureDate") LocalDate departureDate);
}
