package com.wayfinder.server.beans;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

/**
 * A checklist associated with a trip. The user can store items in the checklist
 * to be checked off as they handle them.
 * 
 * @author Ian Johnson
 */
@Entity
public class Checklist {
	@Id
	@SequenceGenerator(name = "seq_checklist_id", sequenceName = "seq_checklist_id")
	@GeneratedValue(generator = "seq_checklist_id", strategy = GenerationType.SEQUENCE)
	private int id;
	/**
	 * The items that this checklist contains.
	 */
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@NotNull
	@Valid
	private List<ChecklistItem> items;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ChecklistItem> getItems() {
		return items;
	}

	public void setItems(List<ChecklistItem> items) {
		this.items = items;
	}
}
