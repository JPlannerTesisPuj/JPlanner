package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Usuario;

public interface IUsuarioService {

	public List<Usuario> findAll();
	public Usuario addUser(Usuario user);
}
