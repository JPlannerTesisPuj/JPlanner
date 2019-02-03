import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from '../model/Subject';
import { BinaryOperator } from '@angular/compiler';

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
   * 
   * Retorna un Observable con el contenido del archivo que se desea leer
   * 
   * @param fileName Nombre del archivo que se quiere obtener
   */
  public readJSONFile(fileName: string): Observable<Subject> {
    return (this.http.get<Subject>(this.baseUrl + 'files/read/json/' + fileName, { withCredentials: true }));
  }

  public filterUnificado(fileName:string, filter):  Observable<Subject> {
    console.log(filter['class-size']);

    if(filter['infoSearch'] === undefined)
      filter['infoSearch'] = "none";

    if(filter['dropdownInfo'] === '')
      filter['dropdownInfo'] = "none";

    //Si no hay dias especificados busque en todos las horas requeridas
    if(filter['days'] == '' && !isNaN(filter['hourFrom']))
      filter['days'] = 'Lunes-Martes-Miercoles-Jueves-Viernes-Sabado-Domingo';
    //Si solo busca por dia, entonces la franja horaria abarca todo el dia
    if(isNaN(filter['hourFrom']) && filter['days'] != 'none'){
      filter['hourFrom'] =  0;
      filter['hourTo'] = '86399 ';
    }

    if(filter['credit1Value'] === null)
      filter['credit1Value'] = -1;

      console.log("credit1Value: " + filter['credit1Value']);
      console.log("credit2Value: " + filter['credit2Value']);

    let url = this.baseUrl + 'files/read/json/' + fileName+'/filter/'
    +filter['days']
    +'/'+filter['hourFrom']
    +'/'+filter['hourTo']
    +'/'+filter['operator']
    +'/'+filter['credit1Value']
    +'/'+filter['credit2Value']
    +'/'+filter['infoSearch']
    +'/'+filter['dropdownInfo'];

    return (this.http.get<Subject>(url, { withCredentials: true }));;
  }

  /**
   * 
   * Retorna un Observable con el contenido filtrado segun los filtros avanzados
   * 
   * @param fileName Nombre del archivo que se quiere obtener
   * @param filter Objeto con los diferentes parametros enviados al backend para filtrar las clases
   * 
   */  
  public advFilter(fileName:string,filter):  Observable<Subject> {
    let op1,op2,comp
    console.log(filter['class-size']);
    op1 = filter['class-size']['firstOp'];
    op2 = filter['class-size']['secondOp'];
    comp = filter['class-size']['comp'];
   
    let classSizePieces = op1+'/'+comp+'/'+op2;
    let url = this.baseUrl + 'files/read/json/' + fileName+'/adv-filter/'
    +filter['teachingMode']
    +'/'+filter['state']
    +'/'+filter['class-ID']
    +'/'+filter['class-number']
    +'/'+filter['class-code']
    +'/'+classSizePieces
    +'/'+filter['scholar-year']
    +'/'+filter['grade'];
    return (this.http.get<Subject>(url, { withCredentials: true }));;
  }
}
