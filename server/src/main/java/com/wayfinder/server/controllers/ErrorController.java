package com.wayfinder.server.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wayfinder.server.beans.ResponseError;

/**
 * The controller used to handle error conditions (overrides the default error
 * page).
 * 
 * @author Ian Johnson
 */
@RestController
@RequestMapping("/error")
public class ErrorController {
	// TODO: update Spring to 4.3 or later and use @RequestAttribute to get the
	// status code from the error that was actually sent.
	@RequestMapping()
	public ResponseEntity<ResponseError> handleError(HttpServletRequest req) {
		int statusCode = (Integer) req.getAttribute("javax.servlet.error.status_code");
		String message = (String) req.getAttribute("javax.servlet.error.message");
		if (message == null) {
			message = "Unexpected error.";
		}
		return new ResponseError(message).toEntity(HttpStatus.valueOf(statusCode));
	}
}
