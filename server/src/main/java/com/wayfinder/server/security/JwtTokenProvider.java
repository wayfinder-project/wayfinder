package com.wayfinder.server.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.temporal.TemporalAmount;
import java.time.temporal.TemporalUnit;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.wayfinder.server.beans.User;
import com.wayfinder.server.services.UserService;

/**
 * A class for generating and parsing JSON Web Tokens.
 * 
 * @author Ian Johnson, Vien Ly
 */
@Component
public class JwtTokenProvider implements InitializingBean {
	private static final Logger logger = LogManager.getLogger();
	private static final String ISSUER = "wayfinder";

	@Value("${JWT_SECRET}")
	private String secret;
	private Algorithm algorithm;
	private JWTVerifier verifier;

	@Autowired
	private UserService userService;

	@Override
	public void afterPropertiesSet() {
		algorithm = Algorithm.HMAC256(secret);
		verifier = JWT.require(algorithm).withIssuer(ISSUER).build();
	}

	/**
	 * Generates a new JWT which can be used to authenticate the user with the given
	 * ID.
	 * 
	 * @param userId the ID of the user to be authenticated by the token
	 * @return the JWT corresponding to the given user ID
	 */
	public String generateToken(int userId) {
		Instant now = Instant.now();
		Instant expires = now.plus(Period.ofDays(1));
		try {
			return JWT.create().withIssuer(ISSUER).withSubject(Integer.toString(userId)).withIssuedAt(Date.from(now))
					.withExpiresAt(Date.from(expires)).sign(algorithm);
		} catch (JWTCreationException e) {
			logger.error("Unexpected error in creating JWT.", e);
			return null;
		}
	}

	/**
	 * Converts the given JWT into an authentication token that can be stored as the
	 * authentication principal in Spring's SecurityContext.
	 * 
	 * @param token the JWT to convert
	 * @return the authentication token, or null if the given JWT was invalid
	 */
	public Authentication getAuthentication(String token) {
		try {
			int userId = Integer.parseInt(verifier.verify(token).getSubject());
			User user = userService.findById(userId);
			if (user == null) {
				return null;
			}
			return new UsernamePasswordAuthenticationToken(user, "", user.getAuthorities());
		} catch (NumberFormatException e) {
			return null;
		} catch (JWTVerificationException e) {
			return null;
		}
	}

	/**
	 * Extracts the JWT from the given request.
	 * 
	 * @param request the request from which to extract the token
	 * @return the token, or null if the request did not contain one
	 */
	public String extractToken(HttpServletRequest request) {
		String auth = request.getHeader("Authorization");
		if (auth == null || !auth.startsWith("Bearer ")) {
			return null;
		}
		return auth.substring("Bearer ".length());
	}
}
