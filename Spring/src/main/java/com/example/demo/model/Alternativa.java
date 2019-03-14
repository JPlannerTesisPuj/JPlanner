package com.example.demo.model;

import javax.persistence.*;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(exclude = "bloqueos")

@Entity
public class Alternativa {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idAlternativa;
	
	@ManyToOne
    @JoinColumn
    private Usuario persona;
	
	@OneToMany(mappedBy = "alternativa", cascade = CascadeType.ALL)
    private Set<Bloqueo> bloqueos;
	
	@ManyToMany(mappedBy = "alternativas")
    private Set<Materia> materias = new HashSet<>();
	
	
	 public Alternativa(int idAlternativa, Bloqueo...bloqueos) {
		 this.idAlternativa = idAlternativa;
		 this.bloqueos = Stream.of(bloqueos).collect(Collectors.toSet());
		 this.bloqueos.forEach(x -> x.setAlternativa(this));
		
	 }


	public int getIdAlternativa() {
		return idAlternativa;
	}


	public void setIdAlternativa(int idAlternativa) {
		this.idAlternativa = idAlternativa;
	}

	public Usuario getPersona() {
		return persona;
	}


	public void setPersona(Usuario persona) {
		this.persona = persona;
	}


	public Set<Bloqueo> getBloqueos() {
		return bloqueos;
	}


	public void setBloqueos(Set<Bloqueo> bloqueos) {
		this.bloqueos = bloqueos;
	}


	public Set<Materia> getMaterias() {
		return materias;
	}


	public void setMaterias(Set<Materia> materias) {
		this.materias = materias;
	}
	 
     

	 
}
