package com.wayfinder.server.beans;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
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
public class Route implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * The ID of the route in the database.
	 */
	@Id
	@SequenceGenerator(name = "seq_route_id", sequenceName = "seq_route_id")
	@GeneratedValue(generator = "seq_route_id", strategy = GenerationType.SEQUENCE)
	private int id;
	/**
	 * The starting point of the route.
	 */
	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@NotNull
	@Valid
	private Waypoint origin;
	/**
	 * The ending point of the route.
	 */
	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@NotNull
	@Valid
	private Waypoint destination;
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

	public Waypoint getOrigin() {
		return origin;
	}

	public void setOrigin(Waypoint origin) {
		this.origin = origin;
	}

	public Waypoint getDestination() {
		return destination;
	}

	public void setDestination(Waypoint destination) {
		this.destination = destination;
	}

	public List<Waypoint> getWaypoints() {
		return waypoints;
	}

	public void setWaypoints(List<Waypoint> waypoints) {
		this.waypoints = waypoints;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((destination == null) ? 0 : destination.hashCode());
		result = prime * result + id;
		result = prime * result + ((origin == null) ? 0 : origin.hashCode());
		result = prime * result + ((waypoints == null) ? 0 : waypoints.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Route other = (Route) obj;
		if (destination == null) {
			if (other.destination != null)
				return false;
		} else if (!destination.equals(other.destination))
			return false;
		if (id != other.id)
			return false;
		if (origin == null) {
			if (other.origin != null)
				return false;
		} else if (!origin.equals(other.origin))
			return false;
		if (waypoints == null) {
			if (other.waypoints != null)
				return false;
		} else if (!waypoints.equals(other.waypoints))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Route [id=" + id + ", origin=" + origin + ", destination=" + destination + ", waypoints=" + waypoints
				+ "]";
	}
}
