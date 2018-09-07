package com.wayfinder.server.exceptions;

/**
 * An exception thrown when a user cannot be found (and must be found). This is
 * meant to be thrown in exceptional situations like attempting to update a
 * non-existent user, and not simply when a user is not found (e.g. when
 * searching by ID, since not finding the user is considered "normal").
 * 
 * @author Ian Johnson
 */
public class UserNotFoundException extends Exception {
	private static final long serialVersionUID = 1L;

	public UserNotFoundException(int id) {
		super("User with ID " + id + " does not exist.");
	}
}
