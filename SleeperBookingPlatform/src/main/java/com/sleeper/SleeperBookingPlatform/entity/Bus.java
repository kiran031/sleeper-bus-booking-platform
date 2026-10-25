package com.sleeper.SleeperBookingPlatform.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Bus {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long busId;

	@Column(unique = true)
	private String busNumber;

	private String busName;

	private String busType;

	private int totalSleepers;

	@OneToMany(mappedBy = "bus")
	private List<Schedule> schedules = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY,optional = false)
	@JoinColumn(name = "layout_id",nullable = false)
	private BusLayout busLayout;

}
