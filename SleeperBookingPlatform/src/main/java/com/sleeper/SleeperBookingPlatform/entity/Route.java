package com.sleeper.SleeperBookingPlatform.entity;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Route {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long routeId;

	private String source;

	private String destination;

	private int distance;

	@ElementCollection
	@CollectionTable(
		    name = "route_middle_stops",
		    joinColumns = @JoinColumn(name = "route_id")
		)

	@Column(name = "stop_name")
	private List<String> middleStops;

	@OneToMany(mappedBy = "route")
	private List<Schedule> schedules;

}
