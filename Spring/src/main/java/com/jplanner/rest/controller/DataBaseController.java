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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

	// MÉTODOS DE INSERCIÓN

	/**
	 * Agrega un usuario al sistema
	 * @param user - Usuario, usuario a agregar
	 * @return ResponseEntity, 200 en caso de éxito y 400 en caso de fallo
	 */
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

	/**
	 * Agrega una materia a una alternativa de horario de un usuario
	 * @param subject - Materia, materia a agregar al horario
	 * @param idAlternative - Integer, número de la alternativa donde se va a agregar la materia
	 * @param idUser - String, ID del estudiante al cual se le va agregar la materia en su alternativa de horario
	 * @return ResponseEntity, 200 en caso de éxito y 400 en caso de fallo
	 */
	@RequestMapping(value = "/rest/addAlternativeSubject/{idAlternative}/{idUser}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> addAlternativeSubject(@RequestBody Materia subject, @PathVariable("idAlternative") Integer idAlternative, @PathVariable("idUser") String idUser) {

		Alternativa alternative = alternativaService.findAlternativeById(new AlternativaKey(idAlternative, idUser));
		Materia auxSubject = materiaService.findSubjectByClassNumber(subject.getNumeroClase());

		if (auxSubject == null) {
			List<Alternativa> alternativesForSubject = new ArrayList<Alternativa>();
			alternativesForSubject.add(alternative);
			subject.setAlternativas(alternativesForSubject);
		} else {
			if(alternative.getMaterias().contains(auxSubject)) {
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
	
	/**
	 * Agrega un bloqueo a la alternativa de Horario de un usuario
	 * @param block - Bloqueo, bloqueo a agregar
	 * @return ResponseEntity, 200 en caso de éxito y 400 en caso de fallo
	 */
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
	
	/**
	 * Elimina una materia de la lista de materias de una alternativa de horario del usuario
	 * @param subject - Materia, materia a agregar al horario
	 * @param idAlternative - Integer, número de la alternativa donde se va a agregar la materia
	 * @param idUser - String, ID del estudiante al cual se le va agregar la materia en su alternativa de horario
	 * @return ResponseEntity, 200 en caso de éxito y 400 en caso de fallo
	 */
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
	
	/**
	 * Elimina un bloqueo de la alternativa de horario de un usuario
	 * @param block - Bloqueo, bloqueo a agregar
	 * @return ResponseEntity, 200 en caso de éxito y 400 en caso de fallo
	 */
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
	
	@RequestMapping(value = "/rest/validate_user/{idUser}", method = RequestMethod.GET)
	public ResponseEntity<String> validateUser(@PathVariable("idUser") String idUser) {

		Usuario user = usuarioService.findUserById(idUser);
		
		if (user != null) {
			
			String filteredUser = "{\"GID\":\""+user.getIdPersona()+"\"}";
			return new ResponseEntity<String>(filteredUser, HttpStatus.OK);
		}
        
		return new ResponseEntity<String>("User not Found", HttpStatus.NOT_FOUND);
	
	}
	
	@RequestMapping(value = "/rest/retrieve_subjects/{idUser}/{idAlternative}", method = RequestMethod.GET)
	public ResponseEntity<List<Materia>> retrieveSubjects(@PathVariable("idUser") String idUser, @PathVariable("idAlternative") Integer idAlternative) throws JsonProcessingException {

		Usuario user = usuarioService.findUserById(idUser);
		if (user != null) {
			Alternativa alternative = alternativaService.findAlternativeById(new AlternativaKey(idAlternative, idUser));
			List<Materia> subjects = alternative.getMaterias();
			return new ResponseEntity<List<Materia>>(subjects, HttpStatus.OK);
		}
        
		return new ResponseEntity<List<Materia>>(new ArrayList<Materia>(), HttpStatus.NOT_FOUND);
	
	}
	
	@RequestMapping(value = "/rest/retrieve_blocks/{idUser}/{idAlternative}", method = RequestMethod.GET)
	public ResponseEntity<List<Bloqueo>> retrieveBlocks(@PathVariable("idUser") String idUser, @PathVariable("idAlternative") Integer idAlternative) throws JsonProcessingException {

		Usuario user = usuarioService.findUserById(idUser);
		if (user != null) {
			Alternativa alternative = alternativaService.findAlternativeById(new AlternativaKey(idAlternative, idUser));
			List<Bloqueo> blocks = alternative.getBloqueos();
			return new ResponseEntity<List<Bloqueo>>(blocks, HttpStatus.OK);
		}
        
		return new ResponseEntity<List<Bloqueo>>(new ArrayList<Bloqueo>(), HttpStatus.NOT_FOUND);
	
	}
	
	@RequestMapping(value = "/rest/user-alternatives/{idUser}", method = RequestMethod.GET)
	public ResponseEntity<List<Alternativa>> retrieveBlocks(@PathVariable("idUser") String idUser) throws JsonProcessingException {

		Usuario user = usuarioService.findUserById(idUser);
		if (user != null) {
			return new ResponseEntity<List<Alternativa>>(user.getAlternativas(), HttpStatus.OK);
		}
        
		return new ResponseEntity<List<Alternativa>>(new ArrayList<Alternativa>(), HttpStatus.NOT_FOUND);
	
	}
	


}
