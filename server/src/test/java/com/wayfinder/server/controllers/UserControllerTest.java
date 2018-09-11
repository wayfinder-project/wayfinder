package com.wayfinder.server.controllers;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
import com.wayfinder.server.exceptions.UserAlreadyExistsException;
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

	/**
	 * A user object to use in tests.
	 */
	User user;
	/**
	 * The list of all user objects in the "database".
	 */
	List<User> users;
	/**
	 * The JSON representation of the user object.
	 */
	String userJson;

	@Before
	public void setUp() {
		user = new User();
		user.setId(1);
		user.setFirstName("Ian");
		user.setLastName("Johnson");
		user.setUsername("ianprime0509");
		user.setEmail("ianprime0509@gmail.com");
		user.setTrips(new ArrayList<>());
		user.setPasswordSalt(Passwords.generateSalt());
		user.setPasswordHash(Passwords.hashPassword("password".toCharArray(), user.getPasswordSalt()));

		users = new ArrayList<>(Arrays.asList(user));

		userJson = "{" + "\"id\": 1," + "\"firstName\": \"Ian\"," + "\"lastName\": \"Johnson\","
				+ "\"username\": \"ianprime0509\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}";

		Mockito.reset(userService);
		when(userService.findAll()).thenReturn(users);
		when(userService.findById(user.getId())).thenReturn(user);
		when(userService.findByUsername(user.getUsername())).thenReturn(user);

		mvc = MockMvcBuilders.webAppContextSetup(appContext).apply(springSecurity()).build();
	}

	@Test
	public void testFindAll() throws Exception {
		String usersJson = "[" + userJson + "]";

		mvc.perform(get("/users").with(user(user))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(usersJson, true));

		verify(userService).findAll();
	}

	@Test
	public void testFindById() throws Exception {
		mvc.perform(get("/users/{id}", user.getId()).with(user(user))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(userJson, true));

		verify(userService).findById(user.getId());
	}

	@Test
	public void testFindByNonExistentId() throws Exception {
		final int id = 100;

		when(userService.findById(id)).thenReturn(null);

		mvc.perform(get("/users/{id}", id).with(user(user))).andExpect(status().isNotFound());

		verify(userService).findById(id);
	}

	@Test
	public void testFindByUsername() throws Exception {
		mvc.perform(get("/users").param("username", user.getUsername()).with(user(user))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(userJson, true));

		verify(userService).findByUsername(user.getUsername());
	}

	@Test
	public void testFindByNonExistentUsername() throws Exception {
		final String username = "nonexistent";

		when(userService.findByUsername(username)).thenReturn(null);
		mvc.perform(get("/users").with(user(user)).param("username", username)).andExpect(status().isNotFound());
	}

	@Test
	public void testAdd() throws Exception {
		User newUser = new User();
		newUser.setId(1);
		newUser.setFirstName("Ian");
		newUser.setLastName("Johnson");
		newUser.setUsername("ianprime05092");
		newUser.setEmail("ianprime0509@gmail.com");
		newUser.setTrips(new ArrayList<>());

		String newUserJson = "{" + "\"id\": 1," + "\"firstName\": \"Ian\"," + "\"lastName\": \"Johnson\","
				+ "\"username\": \"ianprime05092\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}";
		String requestBody = "{\"user\": " + newUserJson + ", \"password\": \"password\"}";

		when(userService.add(newUser, "password".toCharArray())).thenReturn(newUser);

		mvc.perform(post("/users").content(requestBody).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isCreated()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(newUserJson, true));

		verify(userService).add(newUser, "password".toCharArray());
	}

	@Test
	public void testAddDuplicateUsername() throws Exception {
		User newUser = new User();
		newUser.setId(1);
		newUser.setFirstName("Ian");
		newUser.setLastName("Johnson");
		newUser.setUsername("ianprime0509");
		newUser.setEmail("ianprime0509@gmail.com");
		newUser.setTrips(new ArrayList<>());

		String newUserJson = "{" + "\"id\": 1," + "\"firstName\": \"Ian\"," + "\"lastName\": \"Johnson\","
				+ "\"username\": \"ianprime0509\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}";
		String requestBody = "{\"user\": " + newUserJson + ", \"password\": \"password\"}";

		when(userService.add(newUser, "password".toCharArray()))
				.thenThrow(new UserAlreadyExistsException(user.getUsername()));

		mvc.perform(post("/users").content(requestBody).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isConflict()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

		verify(userService).add(newUser, "password".toCharArray());
	}

	@Test
	public void testUpdate() throws Exception {
		User updatedUser = new User();
		updatedUser.setId(1);
		updatedUser.setFirstName("John");
		updatedUser.setLastName("Smith");
		updatedUser.setUsername("ianprime0509");
		updatedUser.setEmail("ianprime0509@gmail.com");
		updatedUser.setTrips(new ArrayList<>());

		String updatedUserJson = "{" + "\"id\": 1," + "\"firstName\": \"John\"," + "\"lastName\": \"Smith\","
				+ "\"username\": \"ianprime0509\"," + "\"email\": \"ianprime0509@gmail.com\"," + "\"trips\": []" + "}";

		when(userService.update(updatedUser)).thenReturn(updatedUser);

		mvc.perform(put("/users/{id}", updatedUser.getId()).with(user(updatedUser)).content(updatedUserJson)
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(updatedUserJson, true));

		verify(userService).update(updatedUser);
	}

	@Test
	public void testUpdatePassword() throws Exception {
		char[] password = "password2".toCharArray();
		String requestJson = "{\"oldPassword\": \"password\"," + "\"newPassword\": \"password2\"}";

		mvc.perform(post("/users/{id}/password", user.getId()).with(user(user)).content(requestJson)
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isOk());

		verify(userService).updatePassword(user.getId(), password);
	}

	@Test
	public void testUpdatePasswordIncorrectPassword() throws Exception {
		char[] password = "password2".toCharArray();
		String requestJson = "{\"oldPassword\": \"password123\"," + "\"newPassword\": \"password2\"}";

		mvc.perform(post("/users/{id}/password", user.getId()).with(user(user)).content(requestJson)
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isForbidden());

		verify(userService, never()).updatePassword(user.getId(), password);
	}
}
