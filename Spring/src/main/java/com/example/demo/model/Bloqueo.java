package com.example.demo.model;

import lombok.*;
import javax.persistence.*;

@Data

@Entity
public class Bloqueo {
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int idBlock;	    
	    private Long startHour;
	    private Long endHour;
	    private Long parentId;

	    @ManyToOne
	    @JoinColumn
	    private Alternativa alternative;

	    
		public Bloqueo(int idBlock, Long startHour, Long endHour, Long parentId,
				Alternativa idAlternative) {
			super();
			this.idBlock = idBlock;
			this.startHour = startHour;
			this.endHour = endHour;
			this.parentId = parentId;
			this.alternative = idAlternative;
		}


		public int getIdBlock() {
			return idBlock;
		}


		public void setIdBlock(int idBlock) {
			this.idBlock = idBlock;
		}


		public Long getStartHour() {
			return startHour;
		}


		public void setStartHour(Long startHour) {
			this.startHour = startHour;
		}


		public Long getEndHour() {
			return endHour;
		}


		public void setEndHour(Long endHour) {
			this.endHour = endHour;
		}


		public Long getParentId() {
			return parentId;
		}


		public void setParentId(Long parentId) {
			this.parentId = parentId;
		}


		public Alternativa getAlternative() {
			return alternative;
		}


		public void setAlternative(Alternativa alternative) {
			this.alternative = alternative;
		}


}


