package com.wayfinder.server.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * A single item on a trip checklist.
 * 
 * @author Ian Johnson
 */
@Entity
public class ChecklistItem {
	@Id
	@SequenceGenerator(name = "seq_checklist_item_id", sequenceName = "seq_checklist_item_id")
	@GeneratedValue(generator = "seq_checklist_item_id", strategy = GenerationType.SEQUENCE)
	private int id;
	/**
	 * The title of this item (e.g. "pack phone charger").
	 */
	@NotEmpty
	@Column(nullable = false)
	private String title;
	/**
	 * The status of this item.
	 */
	@NotNull
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Status status;

	/**
	 * The status of an item in the checklist.
	 * 
	 * @author Ian Johnson
	 */
	public enum Status {
		/**
		 * The item has just been created and is not completed yet.
		 */
		CREATED,
		/**
		 * The item has been completed.
		 */
		DONE,
	}

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

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
}
