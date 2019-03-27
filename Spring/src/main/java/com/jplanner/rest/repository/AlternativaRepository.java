package com.jplanner.rest.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.jplanner.rest.model.Alternativa;

@Repository
public interface AlternativaRepository extends CrudRepository<Alternativa, Integer> {
}
