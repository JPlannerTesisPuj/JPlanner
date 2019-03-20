package com.jplanner.model;

import lombok.*;
import javax.persistence.*;

@Data

@Entity
public class Bloqueo {
	    @Id
	    private String idBlock;	    

	    @ManyToOne
	    @JoinColumn
	    private Alternativa alternative;

	    
		public Bloqueo(String idBlock,Alternativa idAlternative) {
			super();
			this.idBlock = idBlock;
			this.alternative = idAlternative;
		}


		public String getIdBlock() {
			return idBlock;
		}


		public void setIdBlock(String idBlock) {
			this.idBlock = idBlock;
		}



		public Alternativa getAlternative() {
			return alternative;
		}


		public void setAlternative(Alternativa alternative) {
			this.alternative = alternative;
		}


}


