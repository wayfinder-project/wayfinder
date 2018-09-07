package com.wayfinder.server.beans;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * A trip consists of the route that the user intends to take, along with other
 * associated data like the trip checklist and saved points of interest around
 * waypoints.
 * 
 * @author Ian Johnson
 */
@Component
@Scope("prototype")
@Entity
public class Trip {
	/**
	 * The ID of the trip in the database.
	 */
	@Id
	@SequenceGenerator(name = "seq_trip_id", sequenceName = "seq_trip_id")
	@GeneratedValue(generator = "seq_trip_id", strategy = GenerationType.SEQUENCE)
	private int id;
	/**
	 * The date/time on which the trip was created.
	 */
	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
	private Date creationDate;
	/**
	 * The route corresponding to this trip.
	 */
	@OneToOne
	private Route route;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Route getRoute() {
		return route;
	}

	public void setRoute(Route route) {
		this.route = route;
	}
}
