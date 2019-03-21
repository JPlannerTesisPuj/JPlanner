package com.jplanner.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TableController {
	
	@Autowired
	private JdbcTemplate jdbc;
	
	@RequestMapping(value="/createTable",method=RequestMethod.GET)
	public void createTable() {
		
		try {
			jdbc.execute("CREATE TABLE CUSTOMER(" +
					"id SERIAL, name VARCHAR(255), age VARCHAR(255))");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@RequestMapping(value="/putData",method=RequestMethod.GET)
	public void PutData() {
		 
		try {
			jdbc.execute("INSERT INTO customers(id, name, age) VALUES (1,'Debesh','30')");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}

}
