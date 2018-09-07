package com.wayfinder.server.controllers;

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
	public ResponseEntity<ResponseError> handleError() {
		return new ResponseError("Unexpected server error.").toEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
