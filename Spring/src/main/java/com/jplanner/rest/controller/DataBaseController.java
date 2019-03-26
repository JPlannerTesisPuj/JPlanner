package com.jplanner.rest.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jplanner.rest.iservice.IAlternativaService;
import com.jplanner.rest.iservice.IBloqueoService;
import com.jplanner.rest.iservice.IMateriaService;
import com.jplanner.rest.iservice.IUsuarioService;
import com.jplanner.rest.model.Alternativa;
import com.jplanner.rest.model.Bloqueo;
import com.jplanner.rest.model.Materia;
import com.jplanner.rest.model.Usuario;
import com.jplanner.rest.model.key.AlternativaKey;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class DataBaseController {

	// VARIABLES

	public static final int MAX_ALTERNATIVAS = 6;

	@Autowired
	IAlternativaService alternativaService;
	@Autowired
	IBloqueoService bloqueoService;
	@Autowired
	IMateriaService materiaService;
	@Autowired
	IUsuarioService usuarioService;

	// CONSTRUCTORES

	public DataBaseController() {
	}

	// MÉTODOS DE CONSULTA

	@RequestMapping("/showUsers")
	public ResponseEntity<List<Usuario>> findCities() {
		List<Usuario> users = (List<Usuario>) usuarioService.findAll();
		return new ResponseEntity<List<Usuario>>(users, HttpStatus.OK);
	}

	// MÉTODOS DE INSERCIÓN

	@RequestMapping(value = "/rest/addUser", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> addUser(@RequestBody Usuario user) {
		Usuario newUser = usuarioService.addUser(user);

		if (newUser != null) {

			List<Alternativa> alternatives = new ArrayList<Alternativa>();

			for (int cont = 1; cont <= MAX_ALTERNATIVAS; ++cont) {
				alternatives.add(
						alternativaService.addAlternative(new Alternativa(new AlternativaKey(cont, user.getIdPersona()),
								user, new ArrayList<Bloqueo>(), new ArrayList<Materia>())));
			}

			user.setAlternativas(alternatives);
			usuarioService.addUser(user);

			return new ResponseEntity<String>(
					"{\"respuesta\": \"Se ha agregado correctamente al usuario " + user.getIdPersona() + "\"}",
					HttpStatus.OK);
		}

		return new ResponseEntity<String>("{\"respuesta\": \"Se ha producido un error al intentar agregar al usuario  "
				+ user.getIdPersona() + "\"}", HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/rest/addAlternativeSubject/{idAlternative}/{idUser}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> addAlternativeSubject(@RequestBody Materia subject, @PathVariable("idAlternative") Integer idAlternative, @PathVariable("idUser") String idUser) {

		Alternativa alternative = alternativaService.findAlternativeById(new AlternativaKey(idAlternative, idUser));
		Materia auxSubject = materiaService.findSubjectByClassNumber(subject.getNumeroClase());

		if (auxSubject == null) {
			List<Alternativa> alternativesForSubject = new ArrayList<Alternativa>();
			alternativesForSubject.add(alternative);
			subject.setAlternativas(alternativesForSubject);
		} else {
			if(alternative.getSubjects().contains(auxSubject)) {
				return new ResponseEntity<String>("{\"respuesta\": \"La materia "
						+ subject.getNumeroClase() + " ya se encuentra actualmente en el horario\"}", HttpStatus.OK);
			}
			
			subject = auxSubject;
			subject.getAlternativas().add(alternative);
		}
		
		Materia newSubject = materiaService.addSubject(subject);

		if (newSubject != null) {
			return new ResponseEntity<String>("{\"respuesta\": \"Se ha agregado correctamente la materia "
					+ subject.getNumeroClase() + "  a la alternativa de horario\"}", HttpStatus.OK);
		}

		return new ResponseEntity<String>("{\"respuesta\": \"Se ha producido un error al intentar agregar la materia "
				+ subject.getNumeroClase() + " a la alternativa de horario\"}", HttpStatus.BAD_REQUEST);
	}
	
	@RequestMapping(value = "/rest/addBlock", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> addBlock(@RequestBody Bloqueo block) {

		Alternativa alternative = alternativaService.findAlternativeById(block.getBloqueoKey().getAlternativa());
		Bloqueo newBlock = bloqueoService.addBlock(block);
		
		if (newBlock != null) {
			return new ResponseEntity<String>("{\"respuesta\": \"Se ha agregado correctamente el bloqueo  "
					+ newBlock.getNombre() + " a la alternativa de horario\"}", HttpStatus.OK);
		}

		return new ResponseEntity<String>("{\"respuesta\": \"Se ha producido un error al intentar agregar la materia "
				+ block.getNombre() + " a la alternativa de horario\"}", HttpStatus.BAD_REQUEST);
	}

	// MÉTODOS DE ACTUALIZACIÓN

	// MÉTODOS DE ELIMINACIÓN
	
	@RequestMapping(value = "/rest/deleteAlternativeSubject/{idAlternative}/{idUser}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> deleteAlternativeSubject(@RequestBody Materia subject, @PathVariable("idAlternative") Integer idAlternative, @PathVariable("idUser") String idUser) {

		Alternativa alternative = alternativaService.findAlternativeById(new AlternativaKey(idAlternative, idUser));
		Materia auxSubject = materiaService.findSubjectByClassNumber(subject.getNumeroClase());

		if (auxSubject == null) {
			return new ResponseEntity<String>("{\"respuesta\": \"La materia "
					+ subject.getNumeroClase() + "  no existe en el sistema\"}", HttpStatus.OK);
		}
		
		subject = auxSubject;
		Alternativa updatedAlternative = alternativaService.deleteSubjectAlternative(alternative, subject);
		Materia updatedSubject = materiaService.deleteSubjectAlternative(alternative, subject);

		if (updatedAlternative != null && updatedSubject != null) {
			return new ResponseEntity<String>("{\"respuesta\": \"Se ha eliminado correctamente la materia "
					+ subject.getNumeroClase() + " de la alternativa de horario\"}", HttpStatus.OK);
		}

		return new ResponseEntity<String>("{\"respuesta\": \"Se ha producido un error al intentar eliminar la materia "
				+ subject.getNumeroClase() + " de la alternativa de horario\"}", HttpStatus.BAD_REQUEST);
	}
	
	@RequestMapping(value = "/rest/deleteBlock", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> deleteBlock(@RequestBody Bloqueo block) {

		Alternativa alternative = alternativaService.findAlternativeById(block.getBloqueoKey().getAlternativa());
		Bloqueo newBlock = bloqueoService.findBlockById(block.getBloqueoKey());
		
		if (newBlock != null) {
			bloqueoService.deleteBlock(newBlock);
			return new ResponseEntity<String>("{\"respuesta\": \"Se ha eliminado correctamente el bloqueo  "
					+ block.getNombre() + " de la alternativa de horario\"}", HttpStatus.OK);
		}

		return new ResponseEntity<String>("{\"respuesta\": \"Se ha producido un error al intentar eliminar el bloqueo "
				+ block.getNombre() + " de la alternativa de horario\"}", HttpStatus.BAD_REQUEST);
	}


}
