package com.wayfinder.server.exceptions;

/**
 * An exception thrown to indicate that a user already exists (e.g. in response
 * to trying to add a new user with a username that is already taken).
 * 
 * @author Ian Johnson
 */
public class UserAlreadyExistsException extends Exception {
	private static final long serialVersionUID = 1L;

	public UserAlreadyExistsException(String username) {
		super("User with username " + username + " already exists.");
	}
}
