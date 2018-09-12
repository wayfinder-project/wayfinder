package com.wayfinder.server.beans;

import java.io.Serializable;

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
public class ChecklistItem implements Serializable {
	private static final long serialVersionUID = 1L;

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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
		result = prime * result + ((status == null) ? 0 : status.hashCode());
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
		ChecklistItem other = (ChecklistItem) obj;
		if (id != other.id)
			return false;
		if (status != other.status)
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
		return "ChecklistItem [id=" + id + ", title=" + title + ", status=" + status + "]";
	}
}
