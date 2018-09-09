package com.wayfinder.server.beans;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * The data sent with a request to change a user's password.
 * 
 * @author Ian Johnson
 */
public class PasswordChangeRequest {
	@NotEmpty
	private String oldPassword;

	@NotEmpty
	private String newPassword;

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
}
