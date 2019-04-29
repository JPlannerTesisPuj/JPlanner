package com.jplanner.rest.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.PrimaryKeyJoinColumns;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@Table(name = "MATERIAS")
public class Materia {

	// VARIABLES

	@Id
	@Column(name = "numero_clase")
	private String numeroClase;
	private String nombre;

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(
			
		name = "materia_alternativa",
    	joinColumns = @JoinColumn(name = "numero_clase", referencedColumnName = "numero_clase"),
    	inverseJoinColumns = {
    		@JoinColumn(name="id_alternativa", referencedColumnName="id_alternativa", insertable=false, updatable=false),
    		@JoinColumn(name="id_persona", referencedColumnName="id_persona", insertable=false, updatable=false)
		},
    	uniqueConstraints = @UniqueConstraint(columnNames = {"numero_clase", "id_alternativa", "id_persona"})
	)
	@JsonIgnore
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
