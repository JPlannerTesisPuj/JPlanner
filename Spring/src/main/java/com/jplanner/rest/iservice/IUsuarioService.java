package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Usuario;

/**
 * Interfaz para los servicios de Usuarios. Define los métodos de consulta que este servicio tiene que tener.
 */
public interface IUsuarioService {

	/**
	 * Método que retorna todas las tuplas de Usuarios
	 * @return List<Usuario> - usuarios
	 */
	public List<Usuario> findAll();
	
	/**
	 * Agrega una tupla en Usuarios 
	 * @param user - Usuario, usuario a agregar
	 * @return Usuario - El usuario que se agregó. Retorna null si no fue posible agregarlo
	 */
	public Usuario addUser(Usuario user);
	
	/**
	 * Elimina una tupla en Usuarios
	 * @param user - Usuario, usuario a eliminar
	 */
	public void deleteUser(Usuario user);
	
	/**
	 * Encuentra una tupla en Usuarios por su llave primaria
	 * @param userID - String, la llave primaria a encontrar
	 * @return Usuario - Usuario perteneciente a la llave primaria. Retorna null si no lo encuentra.
	 */
	public Usuario findUserById(String userID);
}
