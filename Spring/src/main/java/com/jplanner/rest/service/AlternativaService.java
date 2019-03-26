package com.jplanner.rest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jplanner.rest.iservice.IAlternativaService;
import com.jplanner.rest.model.Alternativa;
import com.jplanner.rest.model.Materia;
import com.jplanner.rest.model.key.AlternativaKey;
import com.jplanner.rest.repository.AlternativaRepository;

@Service
public class AlternativaService implements IAlternativaService{
	
	@Autowired
	private AlternativaRepository alternativaRepository;
	
	@Override
	public List<Alternativa> findAll() {
		return (List<Alternativa>) alternativaRepository.findAll();
	}

	@Override
	public Alternativa addAlternative(Alternativa alternative) {
		return alternativaRepository.save(alternative);
	}
	
	@Override
	public void deleteAlternative(Alternativa alternative) {
		alternativaRepository.delete(alternative);
	}
	
	@Override
	public Alternativa findAlternativeById(AlternativaKey alternativeKey) {
		Iterable<Alternativa> allAlternatives = alternativaRepository.findAll();
		
		for (Alternativa alternative : allAlternatives) {
			if(alternative.getAlternativaKey().equals(alternativeKey)) {
				return alternative;
			}
		}
		
		return null;
	}
	
	@Override
	public Alternativa deleteSubjectAlternative(Alternativa alternative, Materia subjectToDelete) {
		
		for (Materia subject : alternative.getSubjects()) {
			if(subject.getNumeroClase().equals(subjectToDelete.getNumeroClase())) {
				List<Materia> auxSubjects = alternative.getSubjects();
				auxSubjects.remove(subject);
				alternative.setSubjects(auxSubjects);
				return alternativaRepository.save(alternative);
			}
		}
		
		return null;
	}
}
