package com.jplanner.rest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jplanner.rest.iservice.IMateriaService;
import com.jplanner.rest.model.Alternativa;
import com.jplanner.rest.model.Bloqueo;
import com.jplanner.rest.model.Materia;
import com.jplanner.rest.repository.MateriaRepository;

@Service
public class MateriaService implements IMateriaService {

	@Autowired
	private MateriaRepository materiaRepository;

	@Override
	public List<Materia> findAll() {
		return (List<Materia>) materiaRepository.findAll();
	}
	
	@Override
	public Materia addSubject(Materia subject) {
		return materiaRepository.save(subject);
	}
	
	@Override
	public void deleteSubject(Materia subject) {
		materiaRepository.delete(subject);
	}
	
	@Override
	public Materia deleteSubjectAlternative(Alternativa alternativeToDelete, Materia subject) {
		
		for (Alternativa alternative: subject.getAlternativas()) {
			if(alternative.getAlternativaKey().equals(alternativeToDelete.getAlternativaKey())) {
				List<Alternativa> auxalternatives = subject.getAlternativas();
				auxalternatives.remove(alternative);
				subject.setAlternativas(auxalternatives);
				return materiaRepository.save(subject);
			}
		}
		
		return null;
	}
	
	@Override
	public Materia findSubjectByClassNumber(String classNumber) {
		Iterable<Materia> allsubjects = materiaRepository.findAll();
		
		for (Materia subject : allsubjects) {
			if(subject.getNumeroClase().equals(classNumber)) {
				return subject;
			}
		}
		
		return null;
	}
}
