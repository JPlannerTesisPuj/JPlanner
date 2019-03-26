package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Bloqueo;
import com.jplanner.rest.model.key.BloqueoKey;

public interface IBloqueoService {

	public List<Bloqueo> findAll();
	public Bloqueo addBlock(Bloqueo block);
	public void deleteBlock(Bloqueo block);
	public Bloqueo findBlockById(BloqueoKey blockKey);
}
