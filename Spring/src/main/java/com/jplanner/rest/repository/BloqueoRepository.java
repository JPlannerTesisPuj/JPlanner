package com.jplanner.rest.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.jplanner.rest.model.Bloqueo;

@Repository
public interface BloqueoRepository extends CrudRepository<Bloqueo, Integer> {

}
