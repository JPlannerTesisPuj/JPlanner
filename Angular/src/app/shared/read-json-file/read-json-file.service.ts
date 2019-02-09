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
  // URL local
  // private baseUrl: string = 'http://localhost:8080/';
  // URL global
  private baseUrl: string = 'http://34.73.139.18:8080/';

  // Se pide la dependencia de HTTP para poder realizar peticiones
  constructor(private http: HttpClient) { }


  /**
   * 
   * Retorna un Observable con el contenido filtrado segun los filtros avanzados
   * 
   * @param fileName Nombre del archivo que se quiere obtener
   * @param filter Objeto con los diferentes parametros enviados al backend para filtrar las clases
   * 
   */  
  public filter(fileName:string,filter):  Observable<Subject> {
    let op1,op2,comp
    op1 = filter['class-size']['firstOp'];
    op2 = filter['class-size']['secondOp'];
    comp = filter['class-size']['comp'];
   
    let classSizePieces = op1+'/'+comp+'/'+op2;
   
    let days = filter['days'];
    if(days == 'none')
    days = 'Lunes-Martes-Miercoles-Jueves-Viernes-Sabado-Domingo';
    
    let url = this.baseUrl + 'files/read/json/' + fileName+'/class-filter/'
    +days
    +'/'+filter['hours']['from']
    +'/'+filter['hours']['to']
    +'/'+filter['credits']['creditComparator']
    +'/'+filter['credits']['creditValue1']
    +'/'+filter['credits']['creditValue2']
    +'/'+filter['searchBox']['searched']
    +'/'+filter['searchBox']['params']
    +'/'+filter['teachingMode']
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
