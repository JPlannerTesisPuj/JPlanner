package com.jplanner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jplanner.bean.City;
import com.jplanner.services.ICityService;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class MyControler {
	
	@Autowired
	ICityService cityService;
	
	@RequestMapping("/showCities")
	public ResponseEntity<List<City>> findCities(Model model) {
		List<City> cities = (List<City>) cityService.findAll();
		//model.addAttribute("cities", cities);
		return new ResponseEntity<List<City>> (cities, HttpStatus.OK);
	}

	public MyControler() {
		// TODO Auto-generated constructor stub
	}

}
