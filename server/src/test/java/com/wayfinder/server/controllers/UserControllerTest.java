package com.wayfinder.server.controllers;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Arrays;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.wayfinder.server.beans.User;
import com.wayfinder.server.config.ControllerTestConfig;
import com.wayfinder.server.services.UserService;
import com.wayfinder.server.util.Passwords;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = ControllerTestConfig.class)
@WebAppConfiguration
public class UserControllerTest {
	private MockMvc mvc;

	@Autowired
	private UserService userService;

	@Autowired
	private WebApplicationContext appContext;

	@Before
	public void setUp() {
		Mockito.reset(userService);
		mvc = MockMvcBuilders.webAppContextSetup(appContext).build();
	}

	@Test
	public void testFindAll() throws Exception {
		User user = new User();
		user.setId(1);
		user.setFirstName("Ian");
		user.setLastName("Johnson");
		user.setUsername("ianprime0509");
		user.setEmail("ianprime0509@gmail.com");
		user.setTrips(new ArrayList<>());

		String userJson = "[{" + "\"id\": 1," + "\"firstName\": \"Ian\"," + "\"lastName\": \"Johnson\","
				+ "\"username\": \"ianprime0509\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}]";

		when(userService.findAll()).thenReturn(Arrays.asList(user));

		mvc.perform(get("/users")).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(userJson, true));

		verify(userService).findAll();
	}

	@Test
	public void testFindById() throws Exception {
		User user = new User();
		user.setId(1);
		user.setFirstName("Ian");
		user.setLastName("Johnson");
		user.setUsername("ianprime0509");
		user.setEmail("ianprime0509@gmail.com");
		user.setTrips(new ArrayList<>());

		String userJson = "{" + "\"id\": 1," + "\"firstName\": \"Ian\"," + "\"lastName\": \"Johnson\","
				+ "\"username\": \"ianprime0509\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}";

		when(userService.findById(user.getId())).thenReturn(user);

		mvc.perform(get("/users/{id}", user.getId())).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(userJson, true));

		verify(userService).findById(user.getId());
	}

	@Test
	public void testFindByUsername() throws Exception {
		User user = new User();
		user.setId(1);
		user.setFirstName("Ian");
		user.setLastName("Johnson");
		user.setUsername("ianprime0509");
		user.setEmail("ianprime0509@gmail.com");
		user.setTrips(new ArrayList<>());

		String userJson = "{" + "\"id\": 1," + "\"firstName\": \"Ian\"," + "\"lastName\": \"Johnson\","
				+ "\"username\": \"ianprime0509\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}";

		when(userService.findByUsername(user.getUsername())).thenReturn(user);

		mvc.perform(get("/users").param("username", user.getUsername())).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(userJson, true));

		verify(userService).findByUsername(user.getUsername());
	}

	@Test
	public void testAdd() throws Exception {
		User user = new User();
		user.setId(1);
		user.setFirstName("Ian");
		user.setLastName("Johnson");
		user.setUsername("ianprime0509");
		user.setEmail("ianprime0509@gmail.com");
		user.setTrips(new ArrayList<>());

		String newUserJson = "{" + "\"id\": 1," + "\"firstName\": \"Ian\"," + "\"lastName\": \"Johnson\","
				+ "\"username\": \"ianprime0509\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}";
		String requestBody = "{\"user\": " + newUserJson + ", \"password\": \"password\"}";

		when(userService.add(user, "password".toCharArray())).thenReturn(user);

		mvc.perform(post("/users").content(requestBody).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isCreated()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(newUserJson, true));

		verify(userService).add(user, "password".toCharArray());
	}

	@Test
	public void testUpdate() throws Exception {
		User user = new User();
		user.setId(1);
		user.setFirstName("Ian");
		user.setLastName("Johnson");
		user.setUsername("ianprime0509");
		user.setEmail("ianprime0509@gmail.com");
		user.setTrips(new ArrayList<>());

		String updatedUserJson = "{" + "\"id\": 1," + "\"firstName\": \"Ian\"," + "\"lastName\": \"Johnson\","
				+ "\"username\": \"ianprime0509\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}";

		when(userService.update(user)).thenReturn(user);

		mvc.perform(
				put("/users/{id}", user.getId()).content(updatedUserJson).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(updatedUserJson, true));

		verify(userService).update(user);
	}

	@Test
	public void testUpdatePassword() throws Exception {
		User user = new User();
		user.setId(1);
		user.setFirstName("Ian");
		user.setLastName("Johnson");
		user.setUsername("ianprime0509");
		user.setEmail("ianprime0509@gmail.com");
		user.setTrips(new ArrayList<>());
		user.setPasswordSalt(Passwords.generateSalt());
		user.setPasswordHash(Passwords.hashPassword("password".toCharArray(), user.getPasswordSalt()));

		char[] password = "password2".toCharArray();
		String requestJson = "{\"oldPassword\": \"password\"," + "\"newPassword\": \"password2\"}";
		
		when(userService.findById(user.getId())).thenReturn(user);

		mvc.perform(post("/users/{id}/password", user.getId()).content(requestJson)
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isOk())
				.andExpect(content().string(""));

		verify(userService).updatePassword(user.getId(), password);
	}
}
