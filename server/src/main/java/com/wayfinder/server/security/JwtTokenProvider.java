package com.wayfinder.server.security;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
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

@Component
public class JwtTokenProvider {
	private final static Algorithm algorithm = Algorithm.HMAC256("secret");
	private final static JWTVerifier verifier = JWT.require(algorithm).withIssuer("wayfinder").build();
	
	@Autowired
	private UserService userService;
	
	public String generateToken(String username) {
		String token = "";
		Date now = new Date();
		Date validity = new Date(now.getTime() + (24 * 3600 * 1000));
		try {
			token = JWT.create()
					.withIssuer("wayfinder")
					.withSubject(username)
					.withIssuedAt(now)
					.withExpiresAt(validity)
					.sign(algorithm);
		} catch(JWTCreationException e) {
			// handle later
		}
		
		return token;
	}
	
	public Authentication getAuthentication(String token) {
		try {
			String username = verifier.verify(token).getSubject();
			User user = userService.findByUsername(username);
			return new UsernamePasswordAuthenticationToken(user, "", user.getAuthorities());
		} catch (JWTVerificationException e) {
			// handle later
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
