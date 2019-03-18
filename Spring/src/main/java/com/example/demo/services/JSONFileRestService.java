package com.example.demo.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
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

	/**
	 * Devuelve el número de un día en la semana dado su nombre
	 * 
	 * @param day Nombre del día
	 * @return Día del número en la semana
	 */
	private int getDayNumber(String day) {
		switch (day) {
		case "Lunes":
			return 1;
		case "Martes":
			return 2;
		case "Miercoles":
			return 3;
		case "Jueves":
			return 4;
		case "Viernes":
			return 5;
		case "Sabado":
			return 6;
		case "Domingo":
			return 7;

		default:
			return 0;
		}
	}

	// Servicio para filtros de clases
	@RequestMapping(value = "files/read/json/class-filter/{days}/{dayComparator}/{hoursFrom}/{hoursTo}/"
			+ "{creditComparator}/{creditValueOne}/{creditValueTwo}/{searchValue}/{searchParams}/{teachingMode}/{classState}/"
			+ "{classNumber}/{classID}/{classSizeOpOne}/{classSizeOperator}/{classSizeOpTwo}/"
			+ "{schoolarYear}/{grade}/{idStudent}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	/**
	 * 
	 * @param days              Días que se incluyen
	 * @param hoursFrom         Hora inicial
	 * @param hoursTo           Hora final
	 * @param creditComparator  Especifica el comparador de créditos
	 * @param creditValueOne    Valor crédito inicial
	 * @param creditValueTwo    Valor crédito final
	 * @param searchValue       Texto a buscar
	 * @param searchParams      En qué campos va a buscar el texto
	 * @param teachingMode      Método de enseñanza
	 * @param classState        Estado de la clase, abierta o cerrada
	 * @param classID           ID de la clase
	 * @param classNumber       Número de la clase
	 * @param classCode         Código de la clase
	 * @param classSizeOpOne    Límite de cupos inferior
	 * @param classSizeOperator Especifica el comparador de cupos
	 * @param classSizeOpTwo    Límite de cupos superior
	 * @param schoolarYear      Año lectivo
	 * @param grade             Si es pregrado, posgrado o maestría
	 * @return Objeto JSON con las materias filtradas
	 * @throws JsonProcessingException
	 */
	ResponseEntity<String> getJSONClassFilter(@PathVariable("days") String days,
			@PathVariable("hoursFrom") String hoursFrom, @PathVariable("dayComparator") boolean dayComparator,
			@PathVariable("hoursTo") String hoursTo, @PathVariable("creditComparator") String creditComparator,
			@PathVariable("creditValueOne") String creditValueOne,
			@PathVariable("creditValueTwo") String creditValueTwo, @PathVariable("searchValue") String searchValue,
			@PathVariable("searchParams") String searchParams, @PathVariable("teachingMode") String teachingMode,
			@PathVariable("classState") String classState, @PathVariable("classNumber") String classNumber,
			@PathVariable("classID") String classID, @PathVariable("classSizeOpOne") String classSizeOpOne,
			@PathVariable("classSizeOperator") Integer classSizeOperator,
			@PathVariable("classSizeOpTwo") String classSizeOpTwo, @PathVariable("schoolarYear") String schoolarYear,
			@PathVariable("grade") String grade, @PathVariable("idStudent") String idStudent)
			throws JsonProcessingException, ParseException {

		String fileName = "classes";
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
					filter_schoolYear = "", filter_grade = "", filter_days_hours = "", filter_credits = "",
					filter_search = "";

			// Se calcula el numero maximo de horarios de una materia
			ArrayList<Integer> maxNumber = JsonPath.read(JSONFileBuilder.toString(), "$..horarios.length()");
			int horaryMax = (Collections.max(maxNumber));
			String[] arrayDays = days.split("-");
			// Se itera sobre los dias que vienen en la peticion

			// Para esta consulta sólo se utilizarán las fechas de la primera semana de los
			// horarios de
			// las materias teniendo en cuenta que el JSON de clases generado no tiene más
			// de 3 clases por
			// semana y todas las clases se repiten en el mismo horario cada semana;

			filter_days_hours += "(";
			
			int hourFromNumber = Integer.parseInt(hoursFrom) / 3600;
			int hourToNumber = Integer.parseInt(hoursTo) / 3600;
			
			if (dayComparator) {
				filter_days_hours += "(";
				for (int diaHorario = 0; diaHorario < 3; ++diaHorario) {
					filter_days_hours += "(";
					for (String day : arrayDays) {
						int dayNumber = getDayNumber(day);
						filter_days_hours += "@.horarios[" + diaHorario + "].dia==" + dayNumber + "||";
					}
					filter_days_hours = filter_days_hours.substring(0, filter_days_hours.length() - 2);
					filter_days_hours += ")&&";
				}
				filter_days_hours = filter_days_hours.substring(0, filter_days_hours.length() - 2);
				filter_days_hours += ")&&(";
			}

			for (String day : arrayDays) {
				int dayNumber = getDayNumber(day);

				// Busca en los primeros tres días porque en el JSON generado se da máximo una
				// clase
				// tres veces por seman
				for (int diaHorario = 0; diaHorario < 3; ++diaHorario) {
					filter_days_hours += "(@.horarios[" + diaHorario + "].dia==" + dayNumber + " && (@.horarios["
							+ diaHorario + "].horaNumeroInicio >= " + hourFromNumber + " && @.horarios[" + diaHorario
							+ "].horaNumeroFin <= " + hourToNumber + "))" + "||";
				}
			}

			filter_days_hours = filter_days_hours.substring(0, filter_days_hours.length() - 2);
			filter_days_hours += ")";
			if (dayComparator) {
				filter_days_hours += ")";
			}
			
			switch (Integer.parseInt(creditComparator)) {
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

			if (!searchParams.equals("none") && !searchValue.equals("none")) {
				String[] arraydropdownInfo = searchParams.split("-");

				filter_search += "(";
				for (int i = 0; i < arraydropdownInfo.length; ++i) {
					// Se itera sobre las opciones escogidas de la búsqueda específica
					if (arraydropdownInfo[i].equals("Nombre de Asignatura")) {
						filter_search += "@.nombre =~ /.*^.*" + searchValue + ".*$/i || ";
					}
					if (arraydropdownInfo[i].equals("Profesor")) {
						filter_search += "@.profesor =~ /.*^.*" + searchValue + ".*$/i || ";
					}

					if (arraydropdownInfo[i].equals("Unidad Academica")) {
						filter_search += "@.unidadAcademica =~ /.*^.*" + searchValue + ".*$/i || ";
					}
				}

				filter_search = filter_search.substring(0, filter_search.length() - 4);
				filter_search += ")";
			} else {
				filter_search = "@.unidadAcademica && @.profesor && @.nombre";
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

			String baseFilter = "$..[?(" + filter_days_hours + " && " + filter_search + " && @.creditos "
					+ filter_credits + " && @.estado " + filter_state + " && @.modoEnsenanza " + filter_mode
					+ " && @.idCurso " + filter_id + "&& @.numeroClase " + filter_number + " && @.cuposDisponibles "
					+ filter_cupos + " && @.cicloLectivo " + filter_schoolYear + " && @.grado " + filter_grade + ")]";

//			String baseFilter = "$..[?(" + filter_search + " && @.creditos " + filter_credits + " && @.estado "
//					+ filter_state + " && @.modoEnsenanza " + filter_mode + " && @.idCurso " + filter_id
//					+ "&& @.numeroClase " + filter_number + " && @.cuposDisponibles " + filter_cupos
//					+ " && @.cicloLectivo " + filter_schoolYear + " && @.grado " + filter_grade + ")]";

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

	@RequestMapping(value = "tokenauth/{token}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	/**
	 * 
	 * @param token Token del usuario a validar
	 * @return Objeto JSON con la información del usuario al cual pertenece el token
	 * @throws JsonProcessingException
	 */
	ResponseEntity<String> getTokenAuth(@PathVariable("token") String token) throws JsonProcessingException {

		// Se obtiene la información del archivo
		InputStream in = getClass().getResourceAsStream("/json/" + "users" + ".json");

		// Si no existe el archivo se crea un JSON que contiene especificando el error
		if (in == null) {
			errorResponse = new HashMap<>();
			errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
			errorResponse.put("error", "Error al abrir el archivo");
			errorResponse.put("message", "No se ha encontrado el archivo " + "users" + ".json para leer");
			errorResponse.put("path", "tokenauth/" + "users");

			// Convierte el Mapa con la especificación del error en un String en forma de
			// JSON
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

			// Se crea el filtro para buscar el token en users_pensum.json
			String baseFilter = "$..[?(@.credenciales == " + "'" + token + "')]";

			ArrayList<Object> user = JsonPath.read(JSONFileBuilder.toString(), baseFilter);
			String filteredJSON = new ObjectMapper().writeValueAsString(user);

			// Retorna el archivo JSON leído
			return new ResponseEntity<>(filteredJSON, HttpStatus.OK);

		} catch (IOException e) {
			e.printStackTrace();
		}

		// Si hubo un error al leer el archivo se crea un JSON que contiene
		// especificando el error
		errorResponse = new HashMap<>();
		errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
		errorResponse.put("error", "Error al abrir el archivo");
		errorResponse.put("message", "No se pudo leer el archivo " + "users_pensum" + ".json para leer");
		errorResponse.put("path", "/files/read/json/" + "users_pensum");

		// Convierte el Mapa con la especificación del error en un String en forma de
		// SON
		String errorJson = new ObjectMapper().writeValueAsString(errorResponse);

		// Retorna un String en forma de JSON con un error 400
		return new ResponseEntity<>(errorJson, HttpStatus.BAD_REQUEST);
	}
	
}
