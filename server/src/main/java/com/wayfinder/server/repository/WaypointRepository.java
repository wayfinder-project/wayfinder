package com.wayfinder.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wayfinder.server.beans.Waypoint;

@Repository
public interface WaypointRepository extends JpaRepository<Waypoint, Integer> {
}
