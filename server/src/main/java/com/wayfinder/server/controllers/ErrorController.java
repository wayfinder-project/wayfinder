package com.wayfinder.server.controllers;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
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
@ControllerAdvice
@RequestMapping("/error")
public class ErrorController {
	private static final Logger logger = LogManager.getLogger();

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

	/**
	 * Handles the exception thrown when invalid input is sent to a controller.
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ResponseError> handleException(MethodArgumentNotValidException e) {
		BindingResult result = e.getBindingResult();
		// Get a human-readable list of validation failure strings.
		List<String> details = result.getFieldErrors().stream()
				.map(err -> "Error in property \"" + err.getField() + "\": " + err.getDefaultMessage())
				.collect(Collectors.toList());
		return new ResponseError("Input validation failed.", details).toEntity(HttpStatus.BAD_REQUEST);
	}
	
	/**
	 * Handles the exception thrown when a request body cannot be read.
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ResponseError> handleException(HttpMessageNotReadableException e) {
		return new ResponseError("Invalid request body format.").toEntity(HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler
	public ResponseEntity<ResponseError> handleException(Exception e) {
		logger.error("Handling unexpected exception.", e);
		return new ResponseError("An unexpected error occurred.").toEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
