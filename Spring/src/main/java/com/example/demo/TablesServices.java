package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Alternativa;
import com.example.demo.model.Materia;
import com.example.demo.model.MateriaRepository;
import com.example.demo.model.Usuario;
import com.example.demo.model.UsuarioRepository;

import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TablesServices {
	
	@Autowired
	private UsuarioRepository repository;
	@Autowired
	private JdbcTemplate jdbc;
	
	@RequestMapping("/users")
	Iterable<Usuario> findAll() {
		return repository.findAll();
	}

	@RequestMapping("/users/{id}")
	Optional<Usuario> find(@PathVariable("id") Long id) {
		return repository.findById(id);
	}
	
	@RequestMapping(value="/putSubjectData/{class_number}/{name}",method=RequestMethod.GET)
	public void addSubject(@PathVariable("class_number") Long classNumber, 
			 			@PathVariable("name") String name) {
		 
		try {
			
			jdbc.execute("INSERT INTO MATERIA(class_number, name) VALUES ("+classNumber+",'"+name+"')");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@RequestMapping(value="/putUserData/{id_person}/{credentials}",method=RequestMethod.GET)
	public void addUser(@PathVariable("id_person") Long idPerson, 
			 			@PathVariable("credentials") String credentials) {
		 
		try {
			
			jdbc.execute("INSERT INTO USUARIO(id_person, credentials) VALUES ("+idPerson+",'"+credentials+"')");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@RequestMapping(value="/deleteSubjectData/{class_number}",method=RequestMethod.GET)
	public void addUser(@PathVariable("class_number") Long classNumber) {
		 
		try {
			jdbc.execute("DELETE FROM MATERIA WHERE CLASS_NUMBER="+classNumber);
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@RequestMapping(value="/addAlternativeData/{id_person}/{number_alternatives}",method=RequestMethod.GET)
	public void addAlternative(@PathVariable("id_person") Long idPerson,
							   @PathVariable("number_alternatives") Long numberAlternatives) {
		 
		try {
			for(int i=1; i <= numberAlternatives ; i++) {
				jdbc.execute("INSERT INTO ALTERNATIVA(PERSON_ID_PERSON) VALUES ("+idPerson+")");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@RequestMapping(value="/addSubjectAlternative/{id_alternative}/{class_number}",method=RequestMethod.GET)
	public void addSubject_Alternative(@PathVariable("id_alternative") Long idAlternative,
							   @PathVariable("class_number") Long classNumber) {
		 
		try {		
			jdbc.execute("INSERT INTO MATERIA_ALTERNATIVA(CLASS_NUMBER,ID_ALTERNATIVE) VALUES ("+classNumber+","+idAlternative+")");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
	
	
	

	

}
