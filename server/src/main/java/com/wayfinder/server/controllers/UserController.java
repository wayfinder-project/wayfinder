package com.wayfinder.server.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wayfinder.server.beans.ResponseError;
import com.wayfinder.server.beans.User;
import com.wayfinder.server.beans.UserWithPassword;
import com.wayfinder.server.exceptions.UserAlreadyExistsException;
import com.wayfinder.server.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired
	private UserService userService;

	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE, params = "!username")
	public ResponseEntity<List<User>> findAll() {
		return ResponseEntity.ok(userService.findAll());
	}

	@RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<User> findById(@PathVariable("id") int id) {
		User user = userService.findById(id);
		HttpStatus status = user == null ? HttpStatus.NOT_FOUND : HttpStatus.OK;
		return new ResponseEntity<>(user, status);
	}

	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<User> findByUsername(@RequestParam("username") String username) {
		User user = userService.findByUsername(username);
		HttpStatus status = user == null ? HttpStatus.NOT_FOUND : HttpStatus.OK;
		return new ResponseEntity<>(user, status);
	}

	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<?> add(@RequestBody UserWithPassword userWithPassword) {
		try {
			return new ResponseEntity<>(
					userService.add(userWithPassword.getUser(), userWithPassword.getPassword().toCharArray()),
					HttpStatus.CREATED);
		} catch (UserAlreadyExistsException e) {
			return new ResponseError(e).toEntity(HttpStatus.CONFLICT);
		}
	}
}
