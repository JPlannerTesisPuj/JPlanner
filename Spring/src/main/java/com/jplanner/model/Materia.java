package com.jplanner.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(exclude = "alternatives")

@Entity
public class Materia {
		@Id
	    private Long classNumber;
	    private String name;

	    @ManyToMany(cascade = CascadeType.ALL)
	    @JoinTable(name = "materia_alternativa",
	        joinColumns = @JoinColumn(name = "classNumber", referencedColumnName = "classNumber"),
	        inverseJoinColumns = @JoinColumn(name = "idAlternative", referencedColumnName = "idAlternative"))
	    private Set<Alternativa> alternatives;

	    public Materia(Long classNumber, String name, Alternativa... alternatives) {
	        this.classNumber = classNumber;
	    	this.name = name;
	        this.alternatives = Stream.of(alternatives).collect(Collectors.toSet());
	        this.alternatives.forEach(x -> x.getSubjects().add(this));
	    }

		public Long getClassNumber() {
			return classNumber;
		}

		public void setClassNumber(Long classNumber) {
			this.classNumber = classNumber;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public Set<Alternativa> getAlternatives() {
			return alternatives;
		}

		public void setAlternatives(Set<Alternativa> alternatives) {
			this.alternatives = alternatives;
		}

		
	    
}


