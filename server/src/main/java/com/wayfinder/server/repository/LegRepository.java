package com.wayfinder.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wayfinder.server.beans.Leg;

@Repository
public interface LegRepository extends JpaRepository<Leg, Integer> {
}
