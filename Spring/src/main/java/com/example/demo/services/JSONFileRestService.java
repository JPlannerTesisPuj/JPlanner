package com.example.demo.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
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

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

@RestController
@CrossOrigin(origins = "http://localhost:4200",allowCredentials = "true")
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
	
	//Servicio para filtar por hora y dia
	@RequestMapping(value = "files/read/json/{fileName}/{day}/{hour-from}/{hour-to}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	ResponseEntity<String> getJSONFileHourDayFilter(@PathVariable("fileName") String fileName,@PathVariable("day") String day,@PathVariable("hour-from") String hourFrom,@PathVariable("hour-to") String hourTo) throws JsonProcessingException {
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

					BufferedReader streamReader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
					StringBuilder JSONFileBuilder = new StringBuilder();

					// Crea un String con toda la información del archivo JSON
					String inputStringLine;
					while ((inputStringLine = streamReader.readLine()) != null) {
						JSONFileBuilder.append(inputStringLine);
					}
					
					//Se calcula el numero maximo de horarios de una materia
					ArrayList<Integer> maxNumber = JsonPath.read(JSONFileBuilder.toString(), "$..horarios.length()");
					int horaryMax = (Collections.max(maxNumber));
					String[] arrayDays = day.split("-");
					String filter = "$..[?(";
					//Se itera sobre los dias que vienen en la peticion
					for(int i=0 ; i<arrayDays.length;++i) {
						//Se itera sobre el numero maximo de horarios para crear la query
						for (int j = 0; j<horaryMax;++j) {
							filter += "@.horarios["+j+"].dia=='"+arrayDays[i]+"'"+
									" && (@.horarios["+j+"].horaInicio >="+hourFrom
											+ "&& @.horarios["+j+"].horaFin <="+hourTo+")"+"||";
							
						}
					}
					
					
					filter = filter.substring(0, filter.length() - 2);
					filter += ")]";
					
					ArrayList<Object> classes = JsonPath.read(JSONFileBuilder.toString(), filter);
					String filteredJSON = new ObjectMapper().writeValueAsString(classes);
					return new ResponseEntity<>(filteredJSON.toString(), HttpStatus.OK);

				

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

	//Servicio para filtar por creditos
	@RequestMapping(value = "files/read/json/{fileName}/credits/{credit1Value}/{operator}/{credit2Value}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	ResponseEntity<String> getJSONFileCreditsFilter(@PathVariable("fileName") String fileName,@PathVariable("credit1Value") int credit1Value,@PathVariable("operator") int operator,@PathVariable("credit2Value") int credit2Value) throws JsonProcessingException {
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

					BufferedReader streamReader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
					StringBuilder JSONFileBuilder = new StringBuilder();

					// Crea un String con toda la información del archivo JSON
					String inputStringLine;
					while ((inputStringLine = streamReader.readLine()) != null) {
						JSONFileBuilder.append(inputStringLine);
					}
					
					System.out.println(credit1Value);
					System.out.println(credit2Value);
					System.out.println(operator);
					String filter = "$..[?(@.creditos " ;
					//Meneja operador de dos valores
					if(credit1Value > -1) {
						filter+=">= "+credit1Value+"&&@.creditos <= " + credit2Value;
					}
					//Maneja operadores de 1 solo valor
					else if(credit1Value == -1){
						switch(operator) {
						//Mayor a
						case 1:
							filter+=">= ";
							break;
						
						//Menor a
						case 2:
							filter+="<= ";
							break;
							
						//igual a
						case 3:
							filter+="== ";
							break;
						}
						
					}
					filter+=credit2Value+")]";
					ArrayList<Object> classes = JsonPath.read(JSONFileBuilder.toString(), filter);
					String filteredJSON = new ObjectMapper().writeValueAsString(classes);
					return new ResponseEntity<>(filteredJSON.toString(), HttpStatus.OK);
					
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
