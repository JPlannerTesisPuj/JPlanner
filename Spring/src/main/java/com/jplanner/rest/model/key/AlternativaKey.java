package com.jplanner.rest.model.key;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class AlternativaKey implements Serializable {

	@Column(name = "idAlternativa")
	private Integer idAlternativa;
	@Column(name = "idPersona")
	private String persona;

	public AlternativaKey() {
	}

	public AlternativaKey(Integer idAlternativa, String persona) {
		this.idAlternativa = idAlternativa;
		this.persona = persona;
	}

	public Integer getIdAlternativa() {
		return idAlternativa;
	}

	public void setIdAlternativa(Integer idAlternativa) {
		this.idAlternativa = idAlternativa;
	}

	public String getPersona() {
		return persona;
	}

	public void setPersona(String persona) {
		this.persona = persona;
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
		final AlternativaKey other = (AlternativaKey) obj;
		if (this.idAlternativa != other.idAlternativa) {
			return false;
		}
		if (!Objects.equals(this.persona, other.persona)) {
			return false;
		}
		return ((this.idAlternativa == other.idAlternativa) && Objects.equals(this.persona, other.persona));
	}

}
