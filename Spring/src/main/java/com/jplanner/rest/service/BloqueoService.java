package com.jplanner.rest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jplanner.rest.iservice.IBloqueoService;
import com.jplanner.rest.model.Alternativa;
import com.jplanner.rest.model.Bloqueo;
import com.jplanner.rest.model.key.AlternativaKey;
import com.jplanner.rest.model.key.BloqueoKey;
import com.jplanner.rest.repository.BloqueoRepository;

@Service
public class BloqueoService implements IBloqueoService{
	
	@Autowired
	private BloqueoRepository bloqueoRepository;
	
	@Override
	public List<Bloqueo> findAll() {
		return (List<Bloqueo>) bloqueoRepository.findAll();
	}
	
	@Override
	public Bloqueo addBlock(Bloqueo block) {
		return bloqueoRepository.save(block);
	}
	
	@Override
	public void deleteBlock(Bloqueo block) {
		bloqueoRepository.delete(block);
	}
	
	@Override
	public Bloqueo findBlockById(BloqueoKey blockKey) {
		Iterable<Bloqueo> allBlocks = bloqueoRepository.findAll();
		
		for (Bloqueo block : allBlocks) {
			if(block.getBloqueoKey().equals(block.getBloqueoKey())) {
				return block;
			}
		}
		
		return null;
	}
}
