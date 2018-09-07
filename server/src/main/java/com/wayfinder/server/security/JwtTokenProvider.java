package com.wayfinder.server.security;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

@Component
public class JwtTokenProvider {
	private final static Algorithm algorithm = Algorithm.HMAC256("secret");
	private final static JWTVerifier verifier = JWT.require(algorithm).withIssuer("wayfinder").build();
	
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
	
	public String getUsername(String token) {
		try {
			return verifier.verify(token).getSubject();
		} catch (JWTVerificationException e) {
			// handle later
			return null;
		}
	}
	
}
