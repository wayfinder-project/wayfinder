package com.wayfinder.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wayfinder.server.beans.User;
import com.wayfinder.server.repository.UserRepository;

@Service("userService")
@Transactional
public class UserService {

	@Autowired
	private UserRepository userRepo;
	
	public User saveUser(User a) {
		return userRepo.save(a);
	}
	public User updateUser(User a) {
		return userRepo.save(a);
	}
	public User findUserByUsername(String u) {
		return userRepo.findByUsername(u);
	}
	public User findById(int u) {
		return userRepo.findById(u);
	}
	
}
