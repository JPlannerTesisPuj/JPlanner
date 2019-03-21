package com.jplanner.rest.model.key;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class BloqueoKey implements Serializable {

	@Column(name = "idBloqueo")
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

}
