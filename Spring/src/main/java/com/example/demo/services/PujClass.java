package com.example.demo.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import antlr.collections.List;

public class PujClass {
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getNumeroClase() {
		return numeroClase;
	}
	public void setNumeroClase(String numeroClase) {
		this.numeroClase = numeroClase;
	}
	public int getCodigo() {
		return codigo;
	}
	public void setCodigo(int codigo) {
		this.codigo = codigo;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getProfesor() {
		return profesor;
	}
	public void setProfesor(String profesor) {
		this.profesor = profesor;
	}
	public int getCreditos() {
		return creditos;
	}
	public void setCreditos(int creditos) {
		this.creditos = creditos;
	}
	public int getCuposTotales() {
		return cuposTotales;
	}
	public void setCuposTotales(int cuposTotales) {
		this.cuposTotales = cuposTotales;
	}
	public int getCuposDisponibles() {
		return cuposDisponibles;
	}
	public void setCuposDisponibles(int cuposDisponibles) {
		this.cuposDisponibles = cuposDisponibles;
	}
	public String getModoeEnsenanza() {
		return modoeEnsenanza;
	}
	public void setModoeEnsenanza(String modoeEnsenanza) {
		this.modoeEnsenanza = modoeEnsenanza;
	}
	public String getEstado() {
		return estado;
	}
	public void setEstado(String estado) {
		this.estado = estado;
	}
	public String getGrado() {
		return grado;
	}
	public void setGrado(String grado) {
		this.grado = grado;
	}
	public String getSalon() {
		return salon;
	}
	public void setSalon(String salon) {
		this.salon = salon;
	}
	public String getDepartamento() {
		return departamento;
	}
	public void setDepartamento(String departamento) {
		this.departamento = departamento;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public ArrayList<HashMap<String, Object>> getHorarios() {
		return horarios;
	}
	public void setHorarios(ArrayList<HashMap<String, Object>> horarios) {
		this.horarios = horarios;
	}
	@JsonProperty
	String _id;
	@JsonProperty
	String numeroClase;
	@JsonProperty
	int codigo;
	@JsonProperty
	String nombre;
	@JsonProperty
	String profesor;
	@JsonProperty
	int creditos;
	@JsonProperty
	int cuposTotales;
	@JsonProperty
	int cuposDisponibles;
	@JsonProperty
	String modoeEnsenanza;
	@JsonProperty
	String estado;
	@JsonProperty
	String grado;
	@JsonProperty
	String salon;
	@JsonProperty
	String departamento;
	@JsonProperty
	String descripcion;
	@JsonProperty
	ArrayList<HashMap<String,Object>> horarios;
	
	
}

