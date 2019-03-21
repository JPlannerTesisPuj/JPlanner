package com.jplanner.rest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jplanner.bean.City;
import com.jplanner.rest.iservice.ICityService;
import com.jplanner.rest.repository.CityRepository;

@Service
public class CityService implements ICityService {

	@Autowired
	private CityRepository repository;
	
	@Override
	public List<City> findAll() {
		return (List<City>) repository.findAll();
	}

}
