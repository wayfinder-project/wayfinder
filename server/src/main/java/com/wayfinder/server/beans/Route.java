package com.wayfinder.server.beans;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import org.springframework.stereotype.Component;

/**
 * A route is the navigation information for an entire trip, from start to
 * finish.
 * 
 * @author Logan Smith
 */
@Component
@Entity
public class Route {
	/**
	 * The ID of the route in the database.
	 */
	@Id
	@SequenceGenerator(name = "seq_route_id", sequenceName = "seq_route_id")
	@GeneratedValue(generator = "seq_route_id", strategy = GenerationType.SEQUENCE)
	private int id;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}
