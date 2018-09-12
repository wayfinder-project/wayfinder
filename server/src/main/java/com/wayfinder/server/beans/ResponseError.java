package com.wayfinder.server.beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * The type returned as an error when a request fails.
 * 
 * @author Ian Johnson
 */
public class ResponseError implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * The type of the error, if it can be associated with a specific type.
	 */
	private Type type;
	/**
	 * The primary message describing the error.
	 */
	private String message;
	/**
	 * Additional details which may be included.
	 */
	private List<String> details = new ArrayList<>();

	/**
	 * A predefined error type.
	 * 
	 * @author Ian Johnson
	 */
	public enum Type {
		/**
		 * The user is not logged in.
		 */
		NOT_LOGGED_IN,
		/**
		 * The user is logged in, but does not have permission to access an endpoint.
		 */
		UNAUTHORIZED,
	}

	public ResponseError() {
	}

	public ResponseError(String message) {
		this.message = message;
	}

	public ResponseError(String message, List<String> details) {
		this(message);
		this.details = details;
	}

	public ResponseError(Exception e) {
		this(e.getMessage());
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public List<String> getDetails() {
		return details;
	}

	public void setDetails(List<String> details) {
		this.details = details;
	}

	/**
	 * A convenience method for setting the type in a builder-like fashion.
	 * 
	 * @param type the new type of the error
	 * @return <code>this</code>
	 */
	public ResponseError withType(Type type) {
		setType(type);
		return this;
	}

	/**
	 * Converts this error to a ResponseEntity with the given status code.
	 * 
	 * @param status the status code corresponding to the error
	 * @return a ResponseEntity encapsulating the error
	 */
	public ResponseEntity<ResponseError> toEntity(HttpStatus status) {
		return new ResponseEntity<>(this, status);
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((details == null) ? 0 : details.hashCode());
		result = prime * result + ((message == null) ? 0 : message.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
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
		ResponseError other = (ResponseError) obj;
		if (details == null) {
			if (other.details != null)
				return false;
		} else if (!details.equals(other.details))
			return false;
		if (message == null) {
			if (other.message != null)
				return false;
		} else if (!message.equals(other.message))
			return false;
		if (type != other.type)
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "ResponseError [type=" + type + ", message=" + message + ", details=" + details + "]";
	}
}
