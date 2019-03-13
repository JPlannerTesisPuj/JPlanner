package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Usuario;
import com.example.demo.model.UsuarioRepository;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioService {
	
	@Autowired
	private UsuarioRepository repository;
	
	@RequestMapping("/users")
	Iterable<Usuario> findAll() {
		return repository.findAll();
	}

	@RequestMapping("/users/{id}")
	Optional<Usuario> find(@PathVariable("id") Long id) {
		return repository.findById(id);
	}

}
