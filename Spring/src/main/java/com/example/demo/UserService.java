package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.example.demo.model.User;
import com.example.demo.model.UserRepository;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserService {

	@Autowired
	private UserRepository repository;

	@RequestMapping("/users")
	Iterable<User> findAll() {
		return repository.findAll();
	}

	@RequestMapping("/users/{id}")
	Optional<User> find(@PathVariable("id") Long id) {
		return repository.findById(id);
	}
}
