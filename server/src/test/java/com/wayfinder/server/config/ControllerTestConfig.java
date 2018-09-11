package com.wayfinder.server.config;

import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.wayfinder.server.repository.UserRepository;
import com.wayfinder.server.services.UserService;

@Configuration
@EnableWebMvc
@ComponentScan({ "com.wayfinder.server.controllers", "com.wayfinder.server.services", "com.wayfinder.server.security" })
public class ControllerTestConfig {
	@Bean
	public UserService userService() {
		return Mockito.mock(UserService.class);
	}

	@Bean
	public UserRepository userRepository() {
		return Mockito.mock(UserRepository.class);
	}
}
