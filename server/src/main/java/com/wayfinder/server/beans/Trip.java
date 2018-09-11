package com.wayfinder.server.beans;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * A trip consists of the route that the user intends to take, along with other
 * associated data like the trip checklist and saved points of interest around
 * waypoints.
 * 
 * @author Ian Johnson
 */
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
	@NotNull
	private Date creationDate;
	/**
	 * The route corresponding to this trip.
	 */
	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@NotNull
	private Route route;
	/**
	 * Any points of interest that the user has marked.
	 */
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@NotNull
	@Valid
	private Set<AnnotatedWaypoint> pointsOfInterest;
	/**
	 * The checklist associated with this trip.
	 */
	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@NotNull
	@Valid
	private Checklist checklist;

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

	public Set<AnnotatedWaypoint> getPointsOfInterest() {
		return pointsOfInterest;
	}

	public void setPointsOfInterest(Set<AnnotatedWaypoint> pointsOfInterest) {
		this.pointsOfInterest = pointsOfInterest;
	}

	public Checklist getChecklist() {
		return checklist;
	}

	public void setChecklist(Checklist checklist) {
		this.checklist = checklist;
	}
}
