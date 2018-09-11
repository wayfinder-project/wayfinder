package com.wayfinder.server.beans;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.SequenceGenerator;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

/**
 * A route is the navigation information for an entire trip, from start to
 * finish.
 * 
 * @author Logan Smith
 */
@Entity
public class Route {
	/**
	 * The ID of the route in the database.
	 */
	@Id
	@SequenceGenerator(name = "seq_route_id", sequenceName = "seq_route_id")
	@GeneratedValue(generator = "seq_route_id", strategy = GenerationType.SEQUENCE)
	private int id;
	/**
	 * The waypoints of which this route consists, ordered from start to end.
	 */
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@OrderColumn
	@NotNull
	@Valid
	private List<Waypoint> waypoints;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Waypoint> getWaypoints() {
		return waypoints;
	}

	public void setWaypoints(List<Waypoint> waypoints) {
		this.waypoints = waypoints;
	}
}
