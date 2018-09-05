package com.wayfinder.server.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "Routes")
public class Route {

	@Id
	@Column(name = "USER_ID")
	@SequenceGenerator(name = "U_SEQ_GEN", sequenceName = "U_SEQ")
	@GeneratedValue(generator = "U_SEQ_GEN", strategy = GenerationType.SEQUENCE)
	private int id;

	public Route() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Route(int id) {
		super();
		this.id = id;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
}
