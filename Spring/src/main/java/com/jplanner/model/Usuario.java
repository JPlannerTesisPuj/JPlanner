package com.jplanner.model;


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
	private Long idPerson;
	private String credentials;
	
	@OneToMany(mappedBy = "person", cascade = CascadeType.ALL)
	private Set<Alternativa> alternatives;


	
	
	public Usuario(Long idPerson, String credentials, Alternativa...alternatives) {
		this.idPerson = idPerson;
		this.credentials = credentials;
		this.alternatives = Stream.of(alternatives).collect(Collectors.toSet());
	    this.alternatives.forEach(x -> x.setPerson(this));
	}




	public Long getIdPerson() {
		return idPerson;
	}




	public void setIdPerson(Long idPerson) {
		this.idPerson = idPerson;
	}




	public String getCredentials() {
		return credentials;
	}




	public void setCredentials(String credentials) {
		this.credentials = credentials;
	}




	public Set<Alternativa> getAlternatives() {
		return alternatives;
	}




	public void setAlternatives(Set<Alternativa> alternatives) {
		this.alternatives = alternatives;
	}
	

}
