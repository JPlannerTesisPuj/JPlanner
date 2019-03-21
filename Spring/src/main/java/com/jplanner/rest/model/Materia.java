package com.jplanner.rest.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.JoinColumn;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@Table(name = "MATERIAS")
public class Materia {

	// VARIABLES

	@Id
	private String numeroClase;
	private String nombre;

	@ManyToMany(cascade = CascadeType.ALL)
	private List<Alternativa> alternativas;

	// CONSTRUCTORES

	public Materia() {
	}

	public Materia(String numeroClase, String nombre, List<Alternativa> alternativas) {
		this.numeroClase = numeroClase;
		this.nombre = nombre;
		this.alternativas = alternativas;
	}

	// GETTERS Y SETTERS

	public String getNumeroClase() {
		return numeroClase;
	}

	public void setNumeroClase(String numeroClase) {
		this.numeroClase = numeroClase;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public List<Alternativa> getAlternativas() {
		return alternativas;
	}

	public void setAlternativas(List<Alternativa> alternativas) {
		this.alternativas = alternativas;
	}
}
