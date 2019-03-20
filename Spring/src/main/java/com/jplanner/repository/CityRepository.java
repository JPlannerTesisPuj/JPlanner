package com.jplanner.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.jplanner.bean.City;

@Repository
public interface CityRepository extends CrudRepository<City, Long> {
}
