package com.wayfinder.server.beans;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OrderBy;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.context.annotation.Scope;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Component
@Scope("prototype")
@Entity
// We must specify a custom table name here, because "User" is not a valid table
// name in Oracle.
@Table(name = "WayfinderUser")
public class User implements UserDetails {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "seq_user_id", sequenceName = "seq_user_id")
	@GeneratedValue(generator = "seq_user_id", strategy = GenerationType.SEQUENCE)
	private int id;

	@Column(nullable = false, unique = true)
	@NotEmpty
	private String username;

	@Column(nullable = false)
	@JsonIgnore
	private byte[] passwordHash;

	@Column(nullable = false)
	@JsonIgnore
	private byte[] passwordSalt;

	@Column(nullable = false)
	@NotNull
	private String firstName;

	@Column(nullable = false)
	@NotNull
	private String lastName;

	@Column(nullable = false)
	@NotNull
	private String email;

	/**
	 * The user's trips. This list is always in descending order of creation
	 * date/time.
	 */
	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@OrderBy("creationDate")
	@NotNull
	@Valid
	private List<Trip> trips;

	public User() {
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public byte[] getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(byte[] passwordHash) {
		this.passwordHash = passwordHash;
	}

	public byte[] getPasswordSalt() {
		return passwordSalt;
	}

	public void setPasswordSalt(byte[] passwordSalt) {
		this.passwordSalt = passwordSalt;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Trip> getTrips() {
		return trips;
	}

	public void setTrips(List<Trip> trips) {
		this.trips = trips;
	}

	@JsonIgnore
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		GrantedAuthority auth = () -> "USER";
		return Arrays.asList(auth);
	}

	@JsonIgnore
	@Override
	public String getPassword() {
		// We don't store passwords in plain text!
		return "";
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isEnabled() {
		return true;
	}
}
