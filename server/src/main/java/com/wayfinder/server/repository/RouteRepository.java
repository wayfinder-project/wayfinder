package com.wayfinder.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wayfinder.server.beans.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Integer> {
}
