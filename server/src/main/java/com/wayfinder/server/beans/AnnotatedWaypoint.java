package com.wayfinder.server.beans;

import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
@Entity
public class AnnotatedWaypoint extends Waypoint {
	/**
	 * The custom name that the user gave to this waypoint, if any.
	 */
	private String name;
	/**
	 * Any comments that the user may have added to the waypoint.
	 */
	@ElementCollection
	@NotNull
	private List<String> comments;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<String> getComments() {
		return comments;
	}

	public void setComments(List<String> comments) {
		this.comments = comments;
	}
}
