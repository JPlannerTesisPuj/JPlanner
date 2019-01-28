import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from '../model/Subject';

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
  /**
   * 
   * Retorna un Observable con el contenido filtrado por dia y hora archivo que se desea leer
   * 
   * @param fileName Nombre del archivo que se quiere obtener
   * @param arrayWeekDays String separado con - con los dias en los que se filtrara la busqueda
   * @param hourFrom Hora en formato long desde la cual se establecera la franja horaria para filtar
   * @param hourTo Hora en formato long en la cual fializara la franja horaria para filtrar
   */
  public filterClassesDayHour(fileName:string, arrayWeekDays:string, hourFrom, hourTo:string): Observable<Subject> {
    //Si no hay dias especificados busque en todos las horas requeridas
    if(arrayWeekDays=='')
      arrayWeekDays = 'Lunes-Martes-Miercoles-Jueves-Viernes-Sabado-Domingo';
    //Si solo busca por dia, entonces la franja horaria abarca todo el dia
    if(isNaN(hourFrom)){
      hourFrom =  0;
      hourTo = '86399 ';
    }
    return (this.http.get<Subject>(this.baseUrl + 'files/read/json/' + fileName+'/'+arrayWeekDays+"/"+hourFrom+"/"+hourTo, { withCredentials: true }));
  }

  public filterInfoSearch(fileName:string, infoSearch:string): Observable<any> {
    console.log(this.baseUrl + 'files/read/json/' + fileName+'/'+infoSearch);
    return (this.http.get<any>(this.baseUrl + 'files/read/json/' + fileName+'/'+infoSearch, { withCredentials: true }));
  }

  public filterClassesCredits(fileName:string,creditValue1:number,operator:number,creditValue2:number): Observable<Subject> {
    if(creditValue1 === null)
        creditValue1 = -1;
    console.log(this.baseUrl + 'files/read/json/' + fileName+'/credits/'+creditValue1+'/'+operator+'/'+creditValue2);
    return (this.http.get<Subject>(this.baseUrl + 'files/read/json/' + fileName+'/credits/'+creditValue1+'/'+operator+'/'+creditValue2, { withCredentials: true }));

  }

  public filterSchoolYear(fileName:string,cycle:string):  Observable<Subject> {
    console.log(this.baseUrl + 'files/read/json/' + fileName+'/cycle/'+cycle);
    return (this.http.get<Subject>(this.baseUrl + 'files/read/json/' + fileName+'/cycle/'+cycle, { withCredentials: true }));

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
