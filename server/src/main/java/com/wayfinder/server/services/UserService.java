package com.wayfinder.server.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wayfinder.server.beans.User;
import com.wayfinder.server.exceptions.UserAlreadyExistsException;
import com.wayfinder.server.exceptions.UserNotFoundException;
import com.wayfinder.server.repository.UserRepository;
import com.wayfinder.server.util.Passwords;

@Service("userService")
@Transactional
public class UserService {
	@Autowired
	private UserRepository userRepo;

	public List<User> findAll() {
		return userRepo.findAll();
	}

	public User findById(int id) {
		return userRepo.findOne(id);
	}

	public User findByUsername(String username) {
		return userRepo.findByUsername(username);
	}

	/**
	 * Adds a new user into the database with the given password. Any password
	 * information in the user object (salt and hash) will be ignored and
	 * overwritten, as will any user ID.
	 * 
	 * @param user     the user to add
	 * @param password the new user's password
	 * @return the user object that was added to the database
	 * @throws UserAlreadyExistsException if a user with the desired username
	 *                                    already exists
	 */
	public User add(User user, char[] password) throws UserAlreadyExistsException {
		if (findByUsername(user.getUsername()) != null) {
			throw new UserAlreadyExistsException(user.getUsername());
		}
		// Give the user an ID of 0 just in case.
		user.setId(0);
		// Generate a new password salt and hash the password.
		user.setPasswordSalt(Passwords.generateSalt());
		user.setPasswordHash(Passwords.hashPassword(password, user.getPasswordSalt()));

		return userRepo.save(user);
	}

	/**
	 * Updates the user with the given information. Any password data will be
	 * ignored by this method.
	 * 
	 * @param user the user to update
	 * @return the updated user
	 * @throws UserNotFoundException      if the given user object does not have a
	 *                                    valid ID
	 * @throws UserAlreadyExistsException if the user attempts to change their
	 *                                    username to one that is already taken
	 */
	public User update(User user) throws UserNotFoundException, UserAlreadyExistsException {
		// We need to get the user object that's already in the database so we
		// can use its password information and prevent it being overwritten by
		// this method.
		User existing = findById(user.getId());
		if (existing == null) {
			throw new UserNotFoundException(user.getId());
		}
		// Make sure the user doesn't try to sneakily take someone else's username.
		User byUsername = findByUsername(user.getUsername());
		if (byUsername != null && byUsername.getId() != existing.getId()) {
			throw new UserAlreadyExistsException(user.getUsername());
		}
		// Just make sure we save the given user object's password data to avoid
		// leaking it to the client (we'll replace it once we're done updating).
		byte[] salt = user.getPasswordSalt();
		byte[] hash = user.getPasswordHash();
		user.setPasswordSalt(existing.getPasswordSalt());
		user.setPasswordHash(existing.getPasswordHash());

		User saved = userRepo.save(user);
		// Replace the original password data.
		saved.setPasswordSalt(salt);
		saved.setPasswordHash(hash);

		return saved;
	}

	/**
	 * Updates the password of the user with the given ID.
	 * 
	 * @param userId   the ID of the user whose password to update
	 * @param password the user's new password
	 * @throws UserNotFoundException if no user exists with the given ID
	 */
	public void updatePassword(int userId, char[] password) throws UserNotFoundException {
		User user = findById(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		// Generate a new salt and hash the password.
		user.setPasswordSalt(Passwords.generateSalt());
		user.setPasswordHash(Passwords.hashPassword(password, user.getPasswordSalt()));
		userRepo.save(user);
	}
}
