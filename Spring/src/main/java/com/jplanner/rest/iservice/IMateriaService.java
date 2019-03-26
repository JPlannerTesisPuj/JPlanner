package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Alternativa;
import com.jplanner.rest.model.Materia;

public interface IMateriaService {

	public List<Materia> findAll();
	public Materia addSubject(Materia subject);
	public void deleteSubject(Materia subject);
	public Materia findSubjectByClassNumber(String classNumber);
	public Materia deleteSubjectAlternative(Alternativa alternativeToDelete, Materia subject);
}
