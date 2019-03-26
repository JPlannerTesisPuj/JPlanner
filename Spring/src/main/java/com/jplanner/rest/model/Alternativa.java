package com.jplanner.rest.model;

import javax.persistence.CascadeType;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.jplanner.rest.model.key.AlternativaKey;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@Table(name = "ALTERNATIVAS")
public class Alternativa {

	// VARIABLES
	@EmbeddedId
	private AlternativaKey alternativaKey;

	@ManyToOne
	@JoinColumn(name = "id_persona", referencedColumnName = "id_persona", insertable = false, updatable = false)
	private Usuario persona;

	@OneToMany(mappedBy = "alternativa", cascade = CascadeType.ALL)
	private List<Bloqueo> bloqueos;

	@ManyToMany(mappedBy = "alternativas")
	private List<Materia> materias = new ArrayList<Materia>();

	// CONSTRUCTORES

	public Alternativa() {
	}

	public Alternativa(AlternativaKey alternativaKey, Usuario persona, List<Bloqueo> bloqueos, List<Materia> materias) {
		this.alternativaKey = alternativaKey;
		this.persona = persona;
		this.bloqueos = bloqueos;
		this.materias = materias;
	}

	// GETTERS Y SETTERS

	public AlternativaKey getAlternativaKey() {
		return alternativaKey;
	}

	public void setAlternativaKey(AlternativaKey alternativaKey) {
		this.alternativaKey = alternativaKey;
	}

	public Usuario getPersona() {
		return persona;
	}

	public void setPersona(Usuario persona) {
		this.persona = persona;
	}

	public List<Bloqueo> getBloqueos() {
		return bloqueos;
	}

	public void setBloqueos(List<Bloqueo> bloqueos) {
		this.bloqueos = bloqueos;
	}

	public List<Materia> getMaterias() {
		return materias;
	}

	public void setMaterias(List<Materia> materias) {
		this.materias = materias;
	}

}
