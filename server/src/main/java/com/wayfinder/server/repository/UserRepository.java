package com.wayfinder.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.wayfinder.server.beans.User;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Integer> {
	public User findByUsername(String username);
}
