package com.jplanner.rest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jplanner.rest.iservice.IUsuarioService;
import com.jplanner.rest.model.Usuario;
import com.jplanner.rest.repository.UsuarioRepository;

@Service
public class UsuarioService implements IUsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Override
	public List<Usuario> findAll() {
		return (List<Usuario>) usuarioRepository.findAll();
	}
	
	@Override
	public Usuario addUser(Usuario user) {
		return usuarioRepository.save(user);
	}
	
	@Override
	public void deleteUser(Usuario user) {
		usuarioRepository.delete(user);
	}
	
	@Override
	public Usuario findUserById(String userID) {
		Iterable<Usuario> allUsers = usuarioRepository.findAll();
		
		for (Usuario user : allUsers) {
			if(user.getIdPersona().equals(userID)) {
				return user;
			}
		}
		
		return null;
	}
}
