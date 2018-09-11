package com.wayfinder.server.controllers;

import java.util.Arrays;

import javax.validation.Valid;
import javax.validation.constraints.Min;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wayfinder.server.beans.PasswordChangeRequest;
import com.wayfinder.server.beans.ResponseError;
import com.wayfinder.server.beans.User;
import com.wayfinder.server.beans.UserWithPassword;
import com.wayfinder.server.exceptions.UserAlreadyExistsException;
import com.wayfinder.server.exceptions.UserNotFoundException;
import com.wayfinder.server.services.UserService;
import com.wayfinder.server.util.Passwords;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
	@Autowired
	private UserService userService;

	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE, params = "!username")
	public ResponseEntity<ResponseError> findAll() {
		// Currently, there are no admins, so nobody is allowed to list all user
		// data.
		return new ResponseError("Cannot retrieve data for arbitrary users.").withType(ResponseError.Type.UNAUTHORIZED)
				.toEntity(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<?> findById(@PathVariable("id") @Min(0) int id) {
		User user = userService.findById(id);
		if (user == null) {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
		User loggedIn = getLoggedInUser();
		if (loggedIn.getId() != user.getId()) {
			return new ResponseError("Cannot retrieve arbitrary user data.").withType(ResponseError.Type.UNAUTHORIZED)
					.toEntity(HttpStatus.FORBIDDEN);
		}
		return ResponseEntity.ok(user);
	}

	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE, params = "username")
	public ResponseEntity<?> findByUsername(@RequestParam("username") @NotEmpty String username) {
		User user = userService.findByUsername(username);
		if (user == null) {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
		User loggedIn = getLoggedInUser();
		if (!loggedIn.getUsername().equals(user.getUsername())) {
			return new ResponseError("Cannot retrieve arbitrary user data.").withType(ResponseError.Type.UNAUTHORIZED)
					.toEntity(HttpStatus.FORBIDDEN);
		}
		return ResponseEntity.ok(user);
	}

	@RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<?> add(@RequestBody @Valid UserWithPassword userWithPassword) {
		try {
			return new ResponseEntity<User>(
					userService.add(userWithPassword.getUser(), userWithPassword.getPassword().toCharArray()),
					HttpStatus.CREATED);
		} catch (UserAlreadyExistsException e) {
			return new ResponseError(e).toEntity(HttpStatus.CONFLICT);
		}
	}

	@RequestMapping(path = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<?> update(@PathVariable("id") @Min(0) int id, @RequestBody @Valid User user) {
		try {
			if (id != getLoggedInUser().getId()) {
				return new ResponseError("Cannot update other users' data.").withType(ResponseError.Type.UNAUTHORIZED)
						.toEntity(HttpStatus.FORBIDDEN);
			}
			user.setId(id);
			return new ResponseEntity<User>(userService.update(user), HttpStatus.OK);
		} catch (UserNotFoundException e) {
			return new ResponseError(e).toEntity(HttpStatus.NOT_FOUND);
		} catch (UserAlreadyExistsException e) {
			return new ResponseError(e).toEntity(HttpStatus.CONFLICT);
		}
	}

	@RequestMapping(path = "/{id}/password", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<?> updatePassword(@PathVariable("id") @Min(0) int id,
			@RequestBody @Valid PasswordChangeRequest request) {
		try {
			User user = userService.findById(id);
			if (user == null) {
				throw new UserNotFoundException(id);
			}
			if (user.getId() != getLoggedInUser().getId()) {
				return new ResponseError("Cannot update other users' passwords.").withType(ResponseError.Type.UNAUTHORIZED)
						.toEntity(HttpStatus.FORBIDDEN);
			}
			// Make sure that the given old password is correct.
			byte[] oldHash = Passwords.hashPassword(request.getOldPassword().toCharArray(), user.getPasswordSalt());
			if (!Arrays.equals(user.getPasswordHash(), oldHash)) {
				return new ResponseError("Old password is incorrect.").toEntity(HttpStatus.FORBIDDEN);
			}
			userService.updatePassword(id, request.getNewPassword().toCharArray());
			return ResponseEntity.ok().build();
		} catch (UserNotFoundException e) {
			return new ResponseError(e).toEntity(HttpStatus.NOT_FOUND);
		}
	}

	/**
	 * Gets the currently logged-in user (if any).
	 * 
	 * @return the currently logged-in user, or null if none is logged in
	 */
	private User getLoggedInUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth == null ? null : (User) auth.getPrincipal();
	}
}
