package com.wayfinder.server.beans;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * The type returned as an error when a request fails.
 * 
 * @author Ian Johnson
 */
public class ResponseError {
	/**
	 * The primary message describing the error.
	 */
	private String message;
	/**
	 * Additional details which may be included.
	 */
	private List<String> details = new ArrayList<>();

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
	 * Converts this error to a ResponseEntity with the given status code.
	 * 
	 * @param status the status code corresponding to the error
	 * @return a ResponseEntity encapsulating the error
	 */
	public ResponseEntity<ResponseError> toEntity(HttpStatus status) {
		return new ResponseEntity<>(this, status);
	}
}
