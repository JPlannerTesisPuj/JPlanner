package com.example.demo.model;


import javax.persistence.*;

import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(exclude = "alternativass")
@Entity
public class Usuario {
	@Id
	private Long idPersona;
	private String credenciales;
	
	@OneToMany(mappedBy = "persona", cascade = CascadeType.ALL)
	private Set<Alternativa> alternativas;


	
	
	public Usuario(Long idPersona, String credenciales, Alternativa...alternativas) {
		this.idPersona = idPersona;
		this.credenciales = credenciales;
		this.alternativas = Stream.of(alternativas).collect(Collectors.toSet());
	    this.alternativas.forEach(x -> x.setPersona(this));
	}
	
	
	public Long getIdPersona() {
		return idPersona;
	}
	public void setIdPersona(Long idPersona) {
		this.idPersona = idPersona;
	}
	public String getCredenciales() {
		return credenciales;
	}
	public void setCredenciales(String credenciales) {
		this.credenciales = credenciales;
	}


	
	
	
	

}
