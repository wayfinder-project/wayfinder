package com.wayfinder.server.beans;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * The type returned as an error when a request fails.
 * 
 * @author Ian Johnson
 */
public class ResponseError {
	private String message;

	public ResponseError() {
	}

	public ResponseError(String message) {
		this.message = message;
	}
	
	public ResponseError(Exception e) {
		this(e.getMessage());
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
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
}
