package com.jplanner.rest.iservice;

import java.util.List;

import com.jplanner.rest.model.Alternativa;
import com.jplanner.rest.model.key.AlternativaKey;

public interface IAlternativaService {

	public List<Alternativa> findAll();
	public Alternativa addAlternative(Alternativa alternative);
	public Alternativa findById(AlternativaKey alternativeKey);
}
