package com.jplanner.rest.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.jplanner.rest.model.Materia;

@Repository
public interface MateriaRepository extends CrudRepository<Materia, Long> {
}
