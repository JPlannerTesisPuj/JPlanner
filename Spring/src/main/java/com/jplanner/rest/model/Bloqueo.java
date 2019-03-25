package com.jplanner.rest.model;

import java.math.BigInteger;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.jplanner.rest.model.key.BloqueoKey;

@Entity
@Table(name = "BLOQUEOS")
public class Bloqueo {

	// VARIABLES

	@Id
	private String idBloqueo;

	@ManyToOne
	private Alternativa alternativa;

	private BigInteger horaInicio;
	private BigInteger horaFin;
	private String nombre;
	private String idPadre;

	// CONSTRUCTORES

	public Bloqueo() {
	}

	public Bloqueo(String idBloqueo, Alternativa alternativa, BigInteger horaInicio, BigInteger horaFin, String nombre,
			String idPadre) {
		this.idBloqueo = idBloqueo;
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

	public String getIdBloqueo() {
		return idBloqueo;
	}

	public void setIdBloqueo(String idBloqueo) {
		this.idBloqueo = idBloqueo;
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
