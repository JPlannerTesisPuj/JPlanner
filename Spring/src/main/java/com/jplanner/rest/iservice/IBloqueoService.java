package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Bloqueo;

public interface IBloqueoService {

	public List<Bloqueo> findAll();
	public Bloqueo addBlock(Bloqueo block);
}
