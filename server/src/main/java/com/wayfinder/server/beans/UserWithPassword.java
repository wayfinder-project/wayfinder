package com.wayfinder.server.beans;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * The combination of a user object with a password. This corresponds to the
 * JSON object sent with a request to add a new user.
 * 
 * @author Ian Johnson
 */
@Component
@Scope("prototype")
public class UserWithPassword {
	private User user;
	private String password;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
