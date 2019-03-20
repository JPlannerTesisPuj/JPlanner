package com.jplanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jplanner.model.Alternativa;
import com.jplanner.model.Materia;
import com.jplanner.model.MateriaRepository;
import com.jplanner.model.Usuario;
import com.jplanner.model.UsuarioRepository;

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
	// Servicio para guardar materia en la base de datos
	@RequestMapping(value="/putSubjectData/{class_number}/{name}",method=RequestMethod.GET)
	public void addSubject(@PathVariable("class_number") Long classNumber, 
			 			@PathVariable("name") String name) {
		 
		try {
			
			jdbc.execute("INSERT INTO MATERIA(class_number, name) VALUES ("+classNumber+",'"+name+"')");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	// Servicio para guardar un usuario en la base de datos
	@RequestMapping(value="/putUserData/{id_person}/{credentials}",method=RequestMethod.GET)
	public void addUser(@PathVariable("id_person") Long idPerson, 
			 			@PathVariable("credentials") String credentials) {
		 
		try {
			
			jdbc.execute("INSERT INTO USUARIO(id_person, credentials) VALUES ("+idPerson+",'"+credentials+"')");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	// Servicio para eliminar una materia de la base de datos
	@RequestMapping(value="/deleteSubjectData/{class_number}",method=RequestMethod.GET)
	public void deleteSubject(@PathVariable("class_number") Long classNumber) {
		 
		try {
			jdbc.execute("DELETE FROM MATERIA WHERE CLASS_NUMBER="+classNumber);
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	// Servicio para guardar alternativas del usuario en la base de datos
	@RequestMapping(value="/addAlternativeData/{id_person}",method=RequestMethod.GET)
	public void addAlternative(@PathVariable("id_person") Long idPerson) {
		 
		try {
			for(int i=1; i <= 6 ; i++) {
				jdbc.execute("INSERT INTO ALTERNATIVA(PERSON_ID_PERSON) VALUES ("+idPerson+")");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	// Servicio para guardar las materias por alternativa en la base de datos
	@RequestMapping(value="/addSubjectAlternative/{id_alternative}/{class_number}",method=RequestMethod.GET)
	public void addSubject_Alternative(@PathVariable("id_alternative") int idAlternative,
							   @PathVariable("class_number") Long classNumber) {
		 
		try {		
			jdbc.execute("INSERT INTO MATERIA_ALTERNATIVA(CLASS_NUMBER,ID_ALTERNATIVE) VALUES ("+classNumber+","+idAlternative+")");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
    // Servicio para eliminar las materias por alternativa de la base de datos
	@RequestMapping(value="/deleteSubjectAlternative/{id_alternative}/{class_number}",method=RequestMethod.GET)
	public void deleteSubject_Alternative(@PathVariable("id_alternative") int idAlternative,
							   @PathVariable("class_number") Long classNumber) {
		 
		try {		
			
			jdbc.execute("DELETE FROM MATERIA_ALTERNATIVA WHERE CLASS_NUMBER="+classNumber+"AND ID_ALTERNATIVE="+idAlternative);
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	// Servicio para guardar un bloqueo en la base de datos
	@RequestMapping(value="/addBlock/{id_block}/{id_alternative}",method=RequestMethod.GET)
	public void addBlock(
			@PathVariable("id_block") String idBlock,
			@PathVariable("id_alternative") int idAlternative) {
		 
		try {		
			
			jdbc.execute(
					"INSERT INTO BLOQUEO(ID_BLOCK,ALTERNATIVE_ID_ALTERNATIVE) VALUES('"+idBlock+"',"+idAlternative+")");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	// Servicio para eliminar un bloqueo de la base de datos
	@RequestMapping(value="/deleteBlock/{id_block}",method=RequestMethod.GET)
	public void deleteBlock(
			@PathVariable("id_block") String idBlock) {
		 
		try {		
			
			jdbc.execute(
					"DELETE FROM BLOQUEO WHERE ID_BLOCK='"+idBlock+"'");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
	
	
	
	
	
	

	

}
