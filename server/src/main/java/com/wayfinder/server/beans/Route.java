package com.wayfinder.server.beans;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * A route is the navigation information for an entire trip, from start to
 * finish.
 * 
 * @author Logan Smith
 */
@Component
@Scope("prototype")
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
	 * The date/time on which the route was created.
	 */
	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
	private Date creationDate;
	/**
	 * The legs which this route contains. The list is guaranteed to be ordered by
	 * leg index, so that the legs appear in the natural travel order (from start to
	 * end).
	 */
	@Column(nullable = false)
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@OrderBy("index")
	private List<Leg> legs;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}
