package com.example.demo.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class JSONFileRestService {

	// Variable para armar un JSON con un error
	Map<String, Object> errorResponse;

	/**
	 * Método que sirve para leer cualquier archivo JSON que esté ubicado en la carpeta src/main/resources/json y devolverlo como
	 * un JSON mediante la petición de un método GET. El archivo que se leerá será el que pida el usuario por medio de la variable file_name.
	 * 
	 * La URL utilizada para hacer la petición es /files/read/json/{nombre del archivo}
	 * 
	 * @param file_name Nombre del archivo que se leerá
	 * @return JSON con toda la información del archivo
	 * @throws JsonProcessingException Manejador de error si no es posible generar armar una respuesta al no poder leer el archivo
	 */
	@RequestMapping(value = "files/read/json/{fileName}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	ResponseEntity<String> getJSONFile(@PathVariable("fileName") String fileName) throws JsonProcessingException {
		
		// Se obtiene la información del archivo
		InputStream in = getClass().getResourceAsStream("/json/" + fileName + ".json");

		// Si no existe el archivo se crea un JSON que contiene especificando el error
		if (in == null) {
			errorResponse = new HashMap<>();
			errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
			errorResponse.put("error", "Error al abrir el archivo");
			errorResponse.put("message", "No se ha encontrado el archivo " + fileName + ".json para leer");
			errorResponse.put("path", "/files/read/json/" + fileName);
			
			// Convierte el Mapa con la especificación del error en un String en forma de JSON
			String errorJson = new ObjectMapper().writeValueAsString(errorResponse);
			
			// Retorna un String en forma de JSON con un error 400 
			return new ResponseEntity<>(errorJson, HttpStatus.BAD_REQUEST);
		}

		try {
			// Lee el archivo 
			BufferedReader streamReader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
			StringBuilder JSONFileBuilder = new StringBuilder();

			// Crea un String con toda la información del archivo JSON
			String inputStringLine;
			while ((inputStringLine = streamReader.readLine()) != null) {
				JSONFileBuilder.append(inputStringLine);
			}
			
			// Retorna el archivo JSON leído
			return new ResponseEntity<>(JSONFileBuilder.toString(), HttpStatus.OK);

		} catch (IOException e) {
			e.printStackTrace();
		}

		// Si hubo un error al leer el archivo se crea un JSON que contiene especificando el error
		errorResponse = new HashMap<>();
		errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
		errorResponse.put("error", "Error al abrir el archivo");
		errorResponse.put("message", "No se pudo leer el archivo " + fileName + ".json para leer");
		errorResponse.put("path", "/files/read/json/" + fileName);
		
		// Convierte el Mapa con la especificación del error en un String en forma de JSON
		String errorJson = new ObjectMapper().writeValueAsString(errorResponse);
		
		// Retorna un String en forma de JSON con un error 400 
		return new ResponseEntity<>(errorJson, HttpStatus.BAD_REQUEST);

	}
}
