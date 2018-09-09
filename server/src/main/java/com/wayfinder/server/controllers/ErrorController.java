package com.wayfinder.server.controllers;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
@CrossOrigin
public class ErrorController implements AccessDeniedHandler, AuthenticationEntryPoint {
	private static final Logger logger = LogManager.getLogger();

	// TODO: update Spring to 4.3 or later and use @RequestAttribute to get the
	// status code from the error that was actually sent.
	@RequestMapping
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

	/**
	 * Handles the exception thrown when access is denied to an endpoint.
	 */
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ResponseError> handleException(AccessDeniedException e) {
		return new ResponseError(e).withType(ResponseError.Type.UNAUTHORIZED).toEntity(HttpStatus.FORBIDDEN);
	}

	/**
	 * Handles the exception thrown when a user attempts to access an endpoint
	 * without being logged in.
	 */
	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ResponseError> handleException(AuthenticationException e) {
		return new ResponseError(e).withType(ResponseError.Type.NOT_LOGGED_IN).toEntity(HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler
	public ResponseEntity<ResponseError> handleException(Exception e) {
		logger.error("Handling unexpected exception.", e);
		return new ResponseError("An unexpected error occurred.").toEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException, ServletException {
		sendResponseEntity(handleException(accessDeniedException), response);
	}

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		sendResponseEntity(handleException(authException), response);
	}

	/**
	 * A really hacky way of sending a ResponseEntity using an HttpServletResponse
	 * (hopefully there's a better way of doing this and I can remove this method).
	 */
	private void sendResponseEntity(ResponseEntity<?> entity, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException {
		response.setStatus(entity.getStatusCode().value());
		entity.getHeaders().forEach((name, values) -> {
			values.forEach(value -> {
				response.addHeader(name, value);
			});
		});
		// Also make sure to set the CORS headers and content type
		// appropriately, since the @CrossOrigin annotation doesn't do anything
		// if we just call a method normally (not naturally through the
		// ServletDispatcher).
		response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, HEAD, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "*");
		new ObjectMapper().writeValue(response.getWriter(), entity.getBody());
	}
}
