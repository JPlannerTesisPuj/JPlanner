package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Alternativa;
import com.jplanner.rest.model.Materia;
import com.jplanner.rest.model.key.AlternativaKey;


/**
 * Interfaz para los servicios de Alternativas. Define los métodos de consulta que este servicio tiene que tener.
 */
public interface IAlternativaService {

	/**
	 * Método que retorna todas las tuplas de Alternativas
	 * @return List<Alternativa> - alternativas
	 */
	public List<Alternativa> findAll();
	
	/**
	 * Agrega una tupla en Alternativas 
	 * @param alternative - Alternativa, alternativa a agregar
	 * @return Alternativa - La alternativa que se agregó. Retorna null si no fue posible agregarla
	 */
	public Alternativa addAlternative(Alternativa alternative);
	
	/**
	 * Elimina una tupla en Alternativas
	 * @param alternative - Alternativa, alternativa a eliminar
	 */
	public void deleteAlternative(Alternativa alternative);

	/**
	 * Encuentra una tupla en Alternativas por su llave primaria
	 * @param alternativeKey - AlternativaKey, la llave primaria a encontrar
	 * @return Alternativa - Alternativa perteneciente a la llave primaria. Retorna null si no la encuentra.
	 */
	public Alternativa findAlternativeById(AlternativaKey alternativeKey);
	
	/**
	 * Elimina la relación entre la Alternativa y una Materia
	 * @param alternative - Alternativa, alterntiva relacionada
	 * @param subjectToDelete - Materia, materia relacionada
	 * @return Alternativa - Alternativa actualizada
	 */
	public Alternativa deleteSubjectAlternative(Alternativa alternative, Materia subjectToDelete);
}
