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
	@Id
	private Integer idAlternativa;

	@ManyToOne
	@JoinColumn
	private Usuario persona;

	@OneToMany(mappedBy = "alternativa", cascade = CascadeType.ALL)
	private List<Bloqueo> blocks;

	@ManyToMany(mappedBy = "alternativas")
	private List<Materia> materias = new ArrayList<Materia>();

	// CONSTRUCTORES

	public Alternativa() {
	}

	public Alternativa(Integer idAlternativa, Usuario persona, List<Bloqueo> blocks, List<Materia> materias) {
		this.idAlternativa = idAlternativa;
		this.persona = persona;
		this.blocks = blocks;
		this.materias = materias;
	}

	// GETTERS Y SETTERS

	public List<Bloqueo> getBlocks() {
		return blocks;
	}

	public Integer getIdAlternativa() {
		return idAlternativa;
	}

	public void setIdAlternativa(Integer idAlternativa) {
		this.idAlternativa = idAlternativa;
	}

	public void setBlocks(List<Bloqueo> blocks) {
		this.blocks = blocks;
	}

	public List<Materia> getMaterias() {
		return materias;
	}

	public void setMaterias(List<Materia> materias) {
		this.materias = materias;
	}

	public Usuario getPersona() {
		return persona;
	}

	public void setPersona(Usuario persona) {
		this.persona = persona;
	}
}
