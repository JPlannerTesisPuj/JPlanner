package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Bloqueo;
import com.jplanner.rest.model.key.BloqueoKey;

/**
 * Interfaz para los servicios de Bloqueos. Define los métodos de consulta que este servicio tiene que tener.
 */
public interface IBloqueoService {

	/**
	 * Método que retorna todas las tuplas de Bloqueos
	 * @return List<Bloqueo> - bloqueos
	 */
	public List<Bloqueo> findAll();
	
	/**
	 * Agrega una tupla en Bloqueos 
	 * @param block - Bloqueo, bloqueo a agregar
	 * @return Bloqueo - El bloqueo que se agregó. Retorna null si no fue posible agregarlo
	 */
	public Bloqueo addBlock(Bloqueo block);
	
	/**
	 * Elimina una tupla en Bloqueos
	 * @param block - Bloqueo, bloqueo a eliminar
	 */
	public void deleteBlock(Bloqueo block);
	
	/**
	 * Encuentra una tupla en Bloqueos por su llave primaria
	 * @param blockKey - BloqueoKey, la llave primaria a encontrar
	 * @return Bloqueo - Bloqueo perteneciente a la llave primaria. Retorna null si no lo encuentra.
	 */
	public Bloqueo findBlockById(BloqueoKey blockKey);
}
