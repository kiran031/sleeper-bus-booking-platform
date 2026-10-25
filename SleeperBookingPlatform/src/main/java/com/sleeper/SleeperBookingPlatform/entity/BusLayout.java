package com.sleeper.SleeperBookingPlatform.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class BusLayout {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="layout_id")
	private Long layoutId;

	@Column(name="layout_name",nullable = false)
	private String layoutName;

	@OneToMany(
			mappedBy = "busLayout",
			cascade = CascadeType.ALL,
			orphanRemoval = true
			)
	private List<BusLayoutItem> layoutItems = new ArrayList<>();

}
