package com.jplanner.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jplanner.bean.City;
import com.jplanner.repository.CityRepository;

@Service
public class CityService implements ICityService {

	@Autowired
	private CityRepository repository;
	
	@Override
	public List<City> findAll() {
		return (List<City>) repository.findAll();
	}

}
