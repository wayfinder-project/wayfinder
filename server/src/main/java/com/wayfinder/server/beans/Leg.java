package com.wayfinder.server.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * A leg is the route between two adjacent waypoints.
 * 
 * @author Ian Johnson
 */
@Component
@Scope("prototype")
@Entity
public class Leg {
	/**
	 * The ID of the leg in the database.
	 */
	@Id
	@SequenceGenerator(name = "seq_leg_id", sequenceName = "seq_leg_id")
	@GeneratedValue(generator = "seq_leg_id", strategy = GenerationType.SEQUENCE)
	private int id;
	/**
	 * The starting point of the leg.
	 */
	@OneToOne
	private Waypoint start;
	/**
	 * The ending point of the leg.
	 */
	@OneToOne
	private Waypoint end;
	/**
	 * The total travel time of the leg, in seconds.
	 */
	@Column(nullable = false)
	private long travelTime;
	/**
	 * The total distance covered by the leg, in meters.
	 */
	@Column(nullable = false)
	private long distance;
	/**
	 * The index of this leg in the route which contains it (as a 0-based index).
	 */
	@Column(name = "legIndex", nullable = false)
	private int index;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Waypoint getStart() {
		return start;
	}

	public void setStart(Waypoint start) {
		this.start = start;
	}

	public Waypoint getEnd() {
		return end;
	}

	public void setEnd(Waypoint end) {
		this.end = end;
	}

	public long getTravelTime() {
		return travelTime;
	}

	public void setTravelTime(long travelTime) {
		this.travelTime = travelTime;
	}

	public long getDistance() {
		return distance;
	}

	public void setDistance(long distance) {
		this.distance = distance;
	}
}
