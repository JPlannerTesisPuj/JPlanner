package com.jplanner.rest.model.key;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Objeto que será usado para crear la llave primaria de la tabla Bloqueos
 *
 */
@Embeddable
public class BloqueoKey implements Serializable {

	@Column(name = "id_bloqueo")
	private String idBloqueo;
	private AlternativaKey alternativa;

	public BloqueoKey() {
	}

	public BloqueoKey(String idBloqueo, AlternativaKey alternativa) {
		this.idBloqueo = idBloqueo;
		this.alternativa = alternativa;
	}

	public String getIdBloqueo() {
		return idBloqueo;
	}

	public void setIdBloqueo(String idBloqueo) {
		this.idBloqueo = idBloqueo;
	}

	public AlternativaKey getAlternativa() {
		return alternativa;
	}

	public void setAlternativa(AlternativaKey alternativa) {
		this.alternativa = alternativa;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		final BloqueoKey other = (BloqueoKey) obj;
		if (!this.idBloqueo.equals(other.idBloqueo)) {
			return false;
		}
		if (!this.alternativa.equals(other.getAlternativa())) {
			return false;
		}
		return (this.idBloqueo.equals(other.idBloqueo) && this.alternativa.equals(other.getAlternativa()));
	}

}
