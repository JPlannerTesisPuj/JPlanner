package com.jplanner.rest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jplanner.rest.iservice.IAlternativaService;
import com.jplanner.rest.model.Alternativa;
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
	public Alternativa findById(AlternativaKey alternativeKey) {
		Iterable<Alternativa> allALternatives = alternativaRepository.findAll();
		
		for (Alternativa alternative : allALternatives) {
			if(alternative.getIdAlternativa() == alternativeKey.getIdAlternativa() &&
					alternative.getPersona().getIdPersona().equals(alternativeKey.getPersona())) {
				return alternative;
			}
		}
		
		return null;
	}
}
