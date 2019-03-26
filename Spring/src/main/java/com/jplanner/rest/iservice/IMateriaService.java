package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Alternativa;
import com.jplanner.rest.model.Materia;

/**
 * Interfaz para los servicios de Materias. Define los métodos de consulta que este servicio tiene que tener.
 */
public interface IMateriaService {

	/**
	 * Método que retorna todas las tuplas de Materias
	 * @return List<Materia> - materias
	 */
	public List<Materia> findAll();
	
	/**
	 * Agrega una tupla en Materias 
	 * @param subject - Materia, materia a agregar
	 * @return Materia - La materia que se agregó. Retorna null si no fue posible agregarla
	 */
	public Materia addSubject(Materia subject);
	
	/**
	 * Elimina una tupla en Materias
	 * @param subject - Materia, materia a eliminar
	 */
	public void deleteSubject(Materia subject);
	
	/**
	 * Encuentra una tupla en Materias por su llave primaria
	 * @param classNumber - String, la llave primaria a encontrar
	 * @return Materia - Materia perteneciente a la llave primaria. Retorna null si no la encuentra.
	 */
	public Materia findSubjectByClassNumber(String classNumber);
	
	/**
	 * Elimina la relación entre la Materia y una Alternativa
	 * @param alternativeToDelete - Alternativa, alterntiva relacionada
	 * @param subject - Materia, materia relacionada
	 * @return Materia - Materia actualizada
	 */
	public Materia deleteSubjectAlternative(Alternativa alternativeToDelete, Materia subject);
}
