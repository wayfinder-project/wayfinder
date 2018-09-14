package com.wayfinder.server.beans;

import java.io.Serializable;
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

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * A trip consists of the route that the user intends to take, along with other
 * associated data like the trip checklist and saved points of interest around
 * waypoints.
 * 
 * @author Ian Johnson
 */
@Entity
public class Trip implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * The ID of the trip in the database.
	 */
	@Id
	@SequenceGenerator(name = "seq_trip_id", sequenceName = "seq_trip_id")
	@GeneratedValue(generator = "seq_trip_id", strategy = GenerationType.SEQUENCE)
	private int id;
	/**
	 * The title of the trip, as defined by the user.
	 */
	@Column(nullable = false)
	@NotEmpty
	private String title;
	/**
	 * The date/time on which the trip was created.
	 */
	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((checklist == null) ? 0 : checklist.hashCode());
		result = prime * result + ((creationDate == null) ? 0 : creationDate.hashCode());
		result = prime * result + id;
		result = prime * result + ((pointsOfInterest == null) ? 0 : pointsOfInterest.hashCode());
		result = prime * result + ((route == null) ? 0 : route.hashCode());
		result = prime * result + ((title == null) ? 0 : title.hashCode());
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
		Trip other = (Trip) obj;
		if (checklist == null) {
			if (other.checklist != null)
				return false;
		} else if (!checklist.equals(other.checklist))
			return false;
		if (creationDate == null) {
			if (other.creationDate != null)
				return false;
		} else if (!creationDate.equals(other.creationDate))
			return false;
		if (id != other.id)
			return false;
		if (pointsOfInterest == null) {
			if (other.pointsOfInterest != null)
				return false;
		} else if (!pointsOfInterest.equals(other.pointsOfInterest))
			return false;
		if (route == null) {
			if (other.route != null)
				return false;
		} else if (!route.equals(other.route))
			return false;
		if (title == null) {
			if (other.title != null)
				return false;
		} else if (!title.equals(other.title))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Trip [id=" + id + ", title=" + title + ", creationDate=" + creationDate + ", route=" + route
				+ ", pointsOfInterest=" + pointsOfInterest + ", checklist=" + checklist + "]";
	}
}
