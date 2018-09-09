package com.wayfinder.server.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import com.wayfinder.server.controllers.ErrorController;

/**
 * A configuration class for web security, which sets up the JwtTokenFilter.
 * 
 * @author Ian Johnson, Vien Ly
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	private JwtTokenProvider tokenProvider;
	@Autowired
	private ErrorController errorController;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// Matchers for routes that can be accessed without authentication.
		RequestMatcher[] allowable = { new AntPathRequestMatcher("/login", "POST"),
				new AntPathRequestMatcher("/users", "POST"), new AntPathRequestMatcher("/*", "OPTIONS") };

		http.csrf().disable();
		http.authorizeRequests().requestMatchers(allowable).permitAll().anyRequest().authenticated();
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		http.addFilterBefore(new JwtTokenFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);
		http.exceptionHandling().accessDeniedHandler(errorController).authenticationEntryPoint(errorController);
	}
}
