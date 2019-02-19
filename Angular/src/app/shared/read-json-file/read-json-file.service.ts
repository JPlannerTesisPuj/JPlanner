import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from '../model/Subject';
import { BinaryOperator } from '@angular/compiler';
import { User } from '../model/User';

/**
 * Permite consumir servicios externos para leer archivos JSON
 */
@Injectable({
  providedIn: 'root'
})

export class ReadJsonFileService {
  // URL base a donde se harán las peticiones
  private baseUrl: string = 'http://localhost:8080/';

  // Se pide la dependencia de HTTP para poder realizar peticiones
  constructor(private http: HttpClient) { }

  /**
   * Retorna un Observable con el contenido filtrado segun los filtros avanzados
   * 
   * @param fileName Nombre del archivo que se quiere obtener
   * @param filter Objeto con los diferentes parametros enviados al backend para filtrar las clases
   */
  public filter(fileName: string, filter: any): Observable<Subject[]> {
    // Variables que comparan las operaciones del filtro de cupos
    /** @var op1 Número que representa el menor que */
    let op1: any;
    /** @var op2 Número que representa el mayor que */
    let op2: any;
    /** @var comp Número que representa el el indicador de la comparación */
    let comp: any;

    op1 = filter['class-size']['firstOp'];
    op2 = filter['class-size']['secondOp'];
    comp = filter['class-size']['comp'];

    const classSizePieces: string = op1 + '/' + comp + '/' + op2;
    let days = filter['days'];

    if (days == 'none') {
      days = 'Lunes-Martes-Miercoles-Jueves-Viernes-Sabado-Domingo';
    }

    const url: string = this.baseUrl + 'files/read/json/' + fileName + '/class-filter/'
      + days
      + '/' + filter['hours']['from']
      + '/' + filter['hours']['to']
      + '/' + filter['credits']['creditComparator']
      + '/' + filter['credits']['creditValue1']
      + '/' + filter['credits']['creditValue2']
      + '/' + filter['searchBox']['searched']
      + '/' + filter['searchBox']['params']
      + '/' + filter['teachingMode']
      + '/' + filter['state']
      + '/' + filter['class-ID']
      + '/' + filter['class-number']
      + '/' + filter['class-code']
      + '/' + classSizePieces
      + '/' + filter['scholar-year']
      + '/' + filter['grade'];

    return (this.http.get<Subject[]>(url, { withCredentials: true }));
  }

  /**
   * Retorna un Observable con el usuario encontrado segun el token mandado
   * 
   * @param token token del usuario que se intenta autenticar
   */
  public filterToken(token: string): Observable<User[]> {
    return (this.http.get<User[]>(this.baseUrl + 'tokenauth/' + token, { withCredentials: true }));
  }
}
