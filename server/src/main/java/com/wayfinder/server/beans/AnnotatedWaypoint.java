package com.wayfinder.server.beans;

import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * An annotated waypoint is a waypoint along with user-provided information such
 * as a name and comments.
 * 
 * @author Ian Johnson
 */
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
	/**
	 * The URL to an icon representing the type of this waypoint.
	 */
	@NotEmpty
	private String iconUrl;

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

	public String getIconUrl() {
		return iconUrl;
	}

	public void setIconUrl(String iconUrl) {
		this.iconUrl = iconUrl;
	}
}
