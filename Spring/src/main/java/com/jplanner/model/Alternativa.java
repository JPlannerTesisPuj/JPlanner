package com.jplanner.model;

import javax.persistence.*;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(exclude = "blocks")

@Entity
public class Alternativa {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idAlternative;
	
	@ManyToOne
    @JoinColumn
    private Usuario person;
	
	@OneToMany(mappedBy = "alternative", cascade = CascadeType.ALL)
    private Set<Bloqueo> blocks;
	
	@ManyToMany(mappedBy = "alternatives")
    private Set<Materia> subjects = new HashSet<>();
	
	
	 public Alternativa(int idAlternative, Bloqueo...blocks) {
		 this.idAlternative = idAlternative;
		 this.blocks = Stream.of(blocks).collect(Collectors.toSet());
		 this.blocks.forEach(x -> x.setAlternative(this));
		
	 }


	public int getIdAlternative() {
		return idAlternative;
	}


	public void setIdAlternative(int idAlternative) {
		this.idAlternative = idAlternative;
	}


	public Usuario getPerson() {
		return person;
	}


	public void setPerson(Usuario person) {
		this.person = person;
	}


	public Set<Bloqueo> getBlocks() {
		return blocks;
	}


	public void setBlocks(Set<Bloqueo> blocks) {
		this.blocks = blocks;
	}


	public Set<Materia> getSubjects() {
		return subjects;
	}


	public void setSubjects(Set<Materia> subjects) {
		this.subjects = subjects;
	}


	
	 
     

	 
}
