package com.sleeper.SleeperBookingPlatform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sleeper.SleeperBookingPlatform.dto.RouteMatchResponse;
import com.sleeper.SleeperBookingPlatform.entity.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

	@Query("""
			 SELECT DISTINCT r.source
			 FROM Route r
			 WHERE LOWER(r.source) LIKE LOWER(CONCAT(:city,'%'))
			"""
			)
	List<String> findCitiesBySource(@Param("city") String city);

	@Query("""
			 SELECT DISTINCT r.destination
			 FROM Route r
			 WHERE LOWER(r.destination) LIkE LOWER(CONCAT(:city,'%'))
			"""
			)
	List<String> findCitiesByDestination(@Param("city") String city);

	@Query("""
			 SELECT new com.sleeper.SleeperBookingPlatform.dto.RouteMatchResponse(r.source,r.destination)
			 FROM Route r
			 WHERE LOWER(r.source) LIKE LOWER(CONCAT(:source,'%'))
			 AND LOWER(r.destination) LIKE LOWER(CONCAT(:destination,'%'))
			""")
	List<RouteMatchResponse> findRoutesBySourceAndDestination(@Param("source") String source,@Param("destination") String destination);

}
