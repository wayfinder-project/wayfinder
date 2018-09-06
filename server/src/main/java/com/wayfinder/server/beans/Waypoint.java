package com.wayfinder.server.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import org.springframework.stereotype.Component;

/**
 * A waypoint is a single stop on a route. The starting and ending points of a
 * route are themselves considered waypoints.
 * 
 * @author Ian Johnson
 */
@Component
@Entity
public class Waypoint {
	/**
	 * The ID of the waypoint in the database.
	 */
	@Id
	@SequenceGenerator(name = "seq_waypoint_id", sequenceName = "seq_waypoint_id")
	@GeneratedValue(generator = "seq_waypoint_id", strategy = GenerationType.SEQUENCE)
	private int id;
	/**
	 * The latitude coordinate of the waypoint.
	 */
	@Column(nullable = false)
	private double latitude;
	/**
	 * The longitude coordinate of the waypoint.
	 */
	@Column(nullable = false)
	private double longitude;
	/**
	 * The address of the waypoint, as a user-readable string.
	 */
	@Column(nullable = false)
	private String address;

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}
