package com.example.demo.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(exclude = "alternativas")

@Entity
public class Materia {
		@Id
	    private Long numeroClase;
	    private String nombre;

	    @ManyToMany(cascade = CascadeType.ALL)
	    @JoinTable(name = "materia_alternativa",
	        joinColumns = @JoinColumn(name = "numeroClase", referencedColumnName = "numeroClase"),
	        inverseJoinColumns = @JoinColumn(name = "idAlternativa", referencedColumnName = "idAlternativa"))
	    private Set<Alternativa> alternativas;

	    public Materia(Long numeroClase, String name, Alternativa... alternativas) {
	        this.numeroClase = numeroClase;
	    	this.nombre = name;
	        this.alternativas = Stream.of(alternativas).collect(Collectors.toSet());
	        this.alternativas.forEach(x -> x.getMaterias().add(this));
	    }

		public Long getNumeroClase() {
			return numeroClase;
		}

		public void setNumeroClase(Long numeroClase) {
			this.numeroClase = numeroClase;
		}

		public String getNombre() {
			return nombre;
		}

		public void setNombre(String nombre) {
			this.nombre = nombre;
		}

		public Set<Alternativa> getAlternativas() {
			return alternativas;
		}

		public void setAlternativas(Set<Alternativa> alternativas) {
			this.alternativas = alternativas;
		}
	    
}


