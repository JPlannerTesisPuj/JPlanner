import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

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
  public readJSONFile(fileName: string): Observable<any> {
    return (this.http.get<any>(this.baseUrl + 'files/read/json/' + fileName, { withCredentials: true }));
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
  public filterClassesDayHour(fileName:string, arrayWeekDays:string, hourFrom, hourTo:string): Observable<any> {
    //Si no hay dias especificados busque en todos las horas requeridas
    if(arrayWeekDays=='')
      arrayWeekDays = 'Lunes-Martes-Miercoles-Jueves-Viernes-Sabado-Domingo';
    //Si solo busca por dia, entonces la franja horaria abarca todo el dia
    if(isNaN(hourFrom)){
      hourFrom =  0;
      hourTo = '86399 ';
    }
    console.log(arrayWeekDays);
    console.log(this.baseUrl + 'files/read/json/' + fileName+'/'+arrayWeekDays+"/"+hourFrom+"/"+hourTo);
    return (this.http.get<any>(this.baseUrl + 'files/read/json/' + fileName+'/'+arrayWeekDays+"/"+hourFrom+"/"+hourTo, { withCredentials: true }));
  }

}
