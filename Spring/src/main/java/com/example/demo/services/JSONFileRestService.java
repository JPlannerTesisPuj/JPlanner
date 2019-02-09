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
@CrossOrigin(origins = "*", allowCredentials = "true")
public class JSONFileRestService {

	// Variable para armar un JSON con un error
	Map<String, Object> errorResponse;

	
	
	// Servicio para filtros de clases
	@RequestMapping(value = "files/read/json/{fileName}/class-filter/{days}/{hoursFrom}/{hoursTo}/"
			+ "{creditComparator}/{creditValueOne}/{creditValueTwo}/{searchValue}/{searchParams}/{teachingMode}/{classState}/"
			+ "{classID}/{classNumber}/{classCode}/{classSizeOpOne}/{classSizeOperator}/{classSizeOpTwo}/"
			+ "{schoolarYear}/{grade}"
			, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	ResponseEntity<String> getJSONClassFilter(@PathVariable("fileName") String fileName,
			@PathVariable("days") String days,
			@PathVariable("hoursFrom") String hoursFrom,
			@PathVariable("hoursTo") String hoursTo,
			@PathVariable("creditComparator") String creditComparator,
			@PathVariable("creditValueOne") String creditValueOne,
			@PathVariable("creditValueTwo") String creditValueTwo,
			@PathVariable("searchValue") String searchValue,
			@PathVariable("searchParams") String searchParams,
			@PathVariable("teachingMode") String teachingMode,
			@PathVariable("classState") String classState,
			@PathVariable("classID") String classID,
			@PathVariable("classNumber") String classNumber,
			@PathVariable("classCode") String classCode, 
			@PathVariable("classSizeOpOne") String classSizeOpOne,
			@PathVariable("classSizeOperator") Integer classSizeOperator,
			@PathVariable("classSizeOpTwo") String classSizeOpTwo, 
			@PathVariable("schoolarYear") String schoolarYear,
			@PathVariable("grade") String grade) throws JsonProcessingException {
		// Se obtiene la información del archivo
		InputStream in = getClass().getResourceAsStream("/json/" + fileName + ".json");

		// Si no existe el archivo se crea un JSON que contiene especificando el error
		if (in == null) {
			errorResponse = new HashMap<>();
			errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
			errorResponse.put("error", "Error al abrir el archivo");
			errorResponse.put("message", "No se ha encontrado el archivo " + fileName + ".json para leer");
			errorResponse.put("path", "/files/read/json/" + fileName);

			// Convierte el Mapa con la especificación del error en un String en forma de
			// JSON
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
			// Filtro
			String filter_state = "", filter_mode = "", filter_id = "", filter_number = "", filter_cupos = "",
					filter_code = "", filter_schoolYear = "", filter_grade = "",filter_days_hours ="",
					filter_credits = "" , filter_search = "" ;
			
			// Se calcula el numero maximo de horarios de una materia
			ArrayList<Integer> maxNumber = JsonPath.read(JSONFileBuilder.toString(), "$..horarios.length()");
			int horaryMax = (Collections.max(maxNumber));
			String[] arrayDays = days.split("-");
						// Se itera sobre los dias que vienen en la peticion
			filter_days_hours += "(";
			for (int i = 0; i < arrayDays.length; ++i) {
				// Se itera sobre el numero maximo de horarios para crear la query
				for (int j = 0; j < horaryMax; ++j) {
					filter_days_hours += "@.horarios[" + j + "].dia=='" + arrayDays[i] + "'" +
					"&& (@.horarios[" + j+ "].horaInicio >=" + hoursFrom + "&& @.horarios[" + j + "].horaFin <=" + hoursTo + ")"+"||";

				}
			}
			
			filter_days_hours =filter_days_hours.substring(0, filter_days_hours.length() - 2);
			filter_days_hours +=")";
			
			switch(Integer.parseInt(creditComparator)) {
				case 0: {
					filter_credits = "";
					break;
				}
				case 1: {
					filter_credits = ">=" + creditValueTwo;
					break;
				}
				case 2: {
					filter_credits = "<=" + creditValueTwo;
					break;
				}
				case 3: {
					filter_credits = "==" + creditValueTwo;
					break;
				}
				case 4: {
					filter_credits = ">=" + creditValueOne + " && @.creditos <= " + creditValueTwo;
					break;
				}
	
				default:
					break;
				
			}
			
			if(!searchParams.equals("none") && !searchValue.equals("none")) {
				String[] arraydropdownInfo = searchParams.split("-");

				for (int i = 0; i < arraydropdownInfo.length; ++i) {
					// Se itera sobre las opciones escogidas de la búsqueda específica	
					if(arraydropdownInfo[i].equals("Nombre de Asignatura")) {
						filter_search += "@.nombre =~ /.*^.*" + searchValue + ".*$/i || ";
					}
					if(arraydropdownInfo[i].equals("Profesor")) {
						filter_search += "@.profesor =~ /.*^.*" + searchValue + ".*$/i || ";
					}
					
					if(arraydropdownInfo[i].equals("Departamento")) {
						filter_search += "@.departamento =~ /.*^.*" + searchValue + ".*$/i || ";
					}
				}
				
				filter_search = filter_search.substring(0, filter_search.length() - 4);
				
			}else {
				filter_search = "@.departamento && @.profesor && @.nombre";
			}
			
			
			
			if (!teachingMode.equals("none")) {
				if (teachingMode.equals("virtual")) {
					filter_mode = "=='Virtual'";
				} else if (teachingMode.equals("attendance")) {
					filter_mode = "=='Presencial'";
				}
			}
			if (!classState.equals("both")) {
				if (classState.equals("closed")) {
					filter_state = "=='cerrada'";
				} else if (classState.equals("open")) {
					filter_state = "=='abierta'";
				}
			}

			if (!classID.equals("none")) {
				filter_id = "=='" + classID + "'";
			}
			if (!classNumber.equals("none")) {
				filter_number = "=='" + classNumber + "'";
			}
			if (!classCode.equals("none")) {
				filter_code = "=='" + classCode + "'";
			}
			if (!schoolarYear.equals("none")) {
				filter_schoolYear = "=='" + schoolarYear + "'";
			}
			if (!grade.equals("none")) {
				if (grade.equals("master"))
					filter_grade = "=='Maestria'";
				else if (grade.equals("pre"))
					filter_grade = "=='Pregrado'";
				else if (grade.equals("post"))
					filter_grade = "=='Postgrado'";

			}

			switch (classSizeOperator) {
			case 0: {
				filter_cupos = "";
				break;
			}
			case 1: {
				filter_cupos = ">=" + classSizeOpTwo;
				break;
			}
			case 2: {
				filter_cupos = "<=" + classSizeOpTwo;
				break;
			}
			case 3: {
				filter_cupos = "==" + classSizeOpTwo;
				break;
			}
			case 4: {
				filter_cupos = ">=" + classSizeOpOne + " && @.cuposDisponibles <= " + classSizeOpTwo;
				break;
			}

			default:
				break;
			}
			
			String baseFilter = "$..[?("+filter_days_hours +" &&  "+filter_search+ " && @.creditos "+filter_credits
					+ " && @.estado" + filter_state +" && @.modoEnsenanza " + filter_mode + " && @._id "
					+ filter_id + "&& @.numeroClase " + filter_number + " && @.codigo " + filter_code
					+ " && @.cuposDisponibles " + filter_cupos + " && @.ciclo_lectivo " + filter_schoolYear
					+ " && @.grado " + filter_grade + ")]";

			System.out.println(baseFilter);
			
			ArrayList<Object> classes = JsonPath.read(JSONFileBuilder.toString(), baseFilter);
			String filteredJSON = new ObjectMapper().writeValueAsString(classes);
				
			return new ResponseEntity<>(filteredJSON, HttpStatus.OK);
		} catch (IOException e) {
			e.printStackTrace();
		}

		// Si hubo un error al leer el archivo se crea un JSON que contiene
		// especificando el error
		errorResponse = new HashMap<>();
		errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
		errorResponse.put("error", "Error al abrir el archivo");
		errorResponse.put("message", "No se pudo leer el archivo " + fileName + ".json para leer");
		errorResponse.put("path", "/files/read/json/" + fileName);

		// Convierte el Mapa con la especificación del error en un String en forma de
		// JSON
		String errorJson = new ObjectMapper().writeValueAsString(errorResponse);

		// Retorna un String en forma de JSON con un error 400
		return new ResponseEntity<>(errorJson, HttpStatus.BAD_REQUEST);
	}
	
	  	

}
