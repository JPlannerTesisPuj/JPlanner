package com.example.demo.model;

import lombok.*;
import javax.persistence.*;

@Data

@Entity
public class Bloqueo {
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int idBloqueo;	    
	    private Long horaInicio;
	    private Long horaFin;
	    private Long parentId;

	    @ManyToOne
	    @JoinColumn
	    private Alternativa alternativa;

	    
		public Bloqueo(int idBloqueo, Long horaInicio, Long horaFin, Long parentId,
				Alternativa idAlternativa) {
			super();
			this.idBloqueo = idBloqueo;
			this.horaInicio = horaInicio;
			this.horaFin = horaFin;
			this.parentId = parentId;
			this.alternativa = idAlternativa;
		}


		public int getIdBloqueo() {
			return idBloqueo;
		}


		public void setIdBloqueo(int idBloqueo) {
			this.idBloqueo = idBloqueo;
		}


		public Long getHoraInicio() {
			return horaInicio;
		}


		public void setHoraInicio(Long horaInicio) {
			this.horaInicio = horaInicio;
		}


		public Long getHoraFin() {
			return horaFin;
		}


		public void setHoraFin(Long horaFin) {
			this.horaFin = horaFin;
		}

		public Long getParentId() {
			return parentId;
		}


		public void setParentId(Long parentId) {
			this.parentId = parentId;
		}


		public Alternativa getAlternativa() {
			return alternativa;
		}


		public void setAlternativa(Alternativa alternativa) {
			this.alternativa = alternativa;
		}
		
		


		


	    

}


