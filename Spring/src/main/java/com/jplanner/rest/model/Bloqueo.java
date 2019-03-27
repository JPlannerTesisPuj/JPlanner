package com.jplanner.rest.model;

import java.math.BigInteger;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.jplanner.rest.model.key.BloqueoKey;

@Entity
@Table(name = "BLOQUEOS")
public class Bloqueo {

	// VARIABLES

	@EmbeddedId
	private BloqueoKey bloqueoKey;

	@ManyToOne
	@JoinColumns({
		@JoinColumn(name="id_alternativa", referencedColumnName="id_alternativa", insertable=false, updatable=false),
		@JoinColumn(name="id_persona", referencedColumnName="id_persona", insertable=false, updatable=false)
	})
	private Alternativa alternativa;

	private BigInteger horaInicio;
	private BigInteger horaFin;
	private String nombre;
	private String idPadre;

	// CONSTRUCTORES

	public Bloqueo() {
	}

	public Bloqueo(BloqueoKey bloqueoKey, Alternativa alternativa, BigInteger horaInicio, BigInteger horaFin,
			String nombre, String idPadre) {
		this.bloqueoKey = bloqueoKey;
		this.alternativa = alternativa;
		this.horaInicio = horaInicio;
		this.horaFin = horaFin;
		this.nombre = nombre;
		this.idPadre = idPadre;
	}

	// GETTERS Y SETTERS

	public Alternativa getAlternativa() {
		return alternativa;
	}

	public BloqueoKey getBloqueoKey() {
		return bloqueoKey;
	}

	public void setBloqueoKey(BloqueoKey bloqueoKey) {
		this.bloqueoKey = bloqueoKey;
	}

	public void setAlternativa(Alternativa alternativa) {
		this.alternativa = alternativa;
	}

	public BigInteger getHoraInicio() {
		return horaInicio;
	}

	public void setHoraInicio(BigInteger horaInicio) {
		this.horaInicio = horaInicio;
	}

	public BigInteger getHoraFin() {
		return horaFin;
	}

	public void setHoraFin(BigInteger horaFin) {
		this.horaFin = horaFin;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getIdPadre() {
		return idPadre;
	}

	public void setIdPadre(String idPadre) {
		this.idPadre = idPadre;
	}

}
