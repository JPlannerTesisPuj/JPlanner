package com.jplanner.rest.model;

import javax.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@Table(name = "USUARIOS")
public class Usuario {
	
	// VARIABLES
	
	@Id
	private String idPersona;
	private String credenciales;

	@OneToMany(mappedBy = "persona", cascade = CascadeType.ALL)
	private List<Alternativa> alternativas;
	
	// CONSTRUCTORES

	public Usuario() {
	}
	
	public Usuario(String idPersona, String credenciales, List<Alternativa> alternativas) {
		this.idPersona = idPersona;
		this.credenciales = credenciales;
		this.alternativas = alternativas;
	}
	
	// GETTERS Y SETTERS

	public String getIdPersona() {
		return idPersona;
	}

	public void setIdPersona(String idPersona) {
		this.idPersona = idPersona;
	}

	public String getCredenciales() {
		return credenciales;
	}

	public void setCredenciales(String credenciales) {
		this.credenciales = credenciales;
	}

	public List<Alternativa> getAlternativas() {
		return alternativas;
	}

	public void setAlternativas(List<Alternativa> alternativas) {
		this.alternativas = alternativas;
	}

}
