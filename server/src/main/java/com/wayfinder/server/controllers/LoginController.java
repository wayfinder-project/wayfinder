package com.wayfinder.server.controllers;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.wayfinder.server.beans.ResponseError;
import com.wayfinder.server.beans.User;
import com.wayfinder.server.beans.UserCredentials;
import com.wayfinder.server.security.JwtTokenProvider;
import com.wayfinder.server.services.UserService;
import com.wayfinder.server.util.Passwords;

@RestController
@RequestMapping("/login")
@CrossOrigin
public class LoginController {
	@Autowired
	private UserService userService;
	
	@Autowired
	private JwtTokenProvider tokenProvider;

	@RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<?> login(@RequestBody UserCredentials credentials) {
		// Attempt to log the user in.
		User found = userService.findByUsername(credentials.getUsername());
		if (found == null || !Arrays.equals(found.getPasswordHash(),
				Passwords.hashPassword(credentials.getPassword().toCharArray(), found.getPasswordSalt()))) {
			return new ResponseError("Incorrect username or password.").toEntity(HttpStatus.FORBIDDEN);
		}
		// Login successful; generate a token.
		String token = tokenProvider.generateToken(found.getUsername());
		return ResponseEntity.ok('"' + token + '"');
	}
}
