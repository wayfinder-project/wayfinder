package com.wayfinder.server.beans;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * A waypoint is a single stop on a route. The starting and ending points of a
 * route are themselves considered waypoints.
 * 
 * @author Ian Johnson
 */
@Entity
public class Waypoint implements Serializable {
	private static final long serialVersionUID = 1L;

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
	@NotEmpty
	private String address;
	/**
	 * The (optional) place ID, as defined by Google.
	 */
	private String placeId;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

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

	public String getPlaceId() {
		return placeId;
	}

	public void setPlaceId(String placeId) {
		this.placeId = placeId;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((address == null) ? 0 : address.hashCode());
		result = prime * result + id;
		long temp;
		temp = Double.doubleToLongBits(latitude);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(longitude);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		result = prime * result + ((placeId == null) ? 0 : placeId.hashCode());
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
		Waypoint other = (Waypoint) obj;
		if (address == null) {
			if (other.address != null)
				return false;
		} else if (!address.equals(other.address))
			return false;
		if (id != other.id)
			return false;
		if (Double.doubleToLongBits(latitude) != Double.doubleToLongBits(other.latitude))
			return false;
		if (Double.doubleToLongBits(longitude) != Double.doubleToLongBits(other.longitude))
			return false;
		if (placeId == null) {
			if (other.placeId != null)
				return false;
		} else if (!placeId.equals(other.placeId))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Waypoint [id=" + id + ", latitude=" + latitude + ", longitude=" + longitude + ", address=" + address
				+ ", placeId=" + placeId + "]";
	}
}
