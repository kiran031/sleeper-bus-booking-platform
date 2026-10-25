package com.sleeper.SleeperBookingPlatform.entity;

import com.sleeper.SleeperBookingPlatform.enms.DeckLevel;
import com.sleeper.SleeperBookingPlatform.enms.LayoutItemType;

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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(uniqueConstraints = @UniqueConstraint(
		name = "uk_layout_position_code",
		columnNames = {"layout_id","position_code"}
		))
@Entity
public class BusLayoutItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long layoutItemId;


	@Column(name="position_code",nullable = false)
	private String positionCode;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private LayoutItemType itemType;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DeckLevel deckLevel;

	@Column(name = "seat_row", nullable = false)
	private int rowNumber;

	@Column(name="column_number",nullable = false)
	private int columnNumber;

	@Column(name = "column_span", nullable = false)
	private int columnSpan = 1;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "layout_id",nullable = false)
	private BusLayout busLayout;

}
