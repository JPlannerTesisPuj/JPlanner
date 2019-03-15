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
  private userToken: User = null;

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

    if (this.userToken != null) {
      const url: string = this.baseUrl + 'files/read/json/class-filter/'
        + days
        + '/' + filter['dayComparator']
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
        + '/' + classSizePieces
        + '/' + filter['scholar-year']
        + '/' + filter['grade']
        + '/' + this.userToken.GID;

      return (this.http.get<Subject[]>(url, { withCredentials: true }));
    }

    return null;

  }

  /**
   * Retorna un Observable con el usuario encontrado segun el token mandado
   * 
   * @param token token del usuario que se intenta autenticar
   */
  public filterToken(token: string): Observable<User[]> {
    return (this.http.get<User[]>(this.baseUrl + 'tokenauth/' + token, { withCredentials: true }));
  }
  
  public saveSubject(classNumber: any, name: string): Observable<any>{
    return (
      this.http.get<any>(
        this.baseUrl + 'putSubjectData/' + classNumber +'/'+name,{ withCredentials: true })
      );
  }
 
  public saveUser(idPerson: any, credentials: string): Observable<any>{
    return (
      this.http.get<any>(
        this.baseUrl + 'putUserData/' + idPerson +'/'+credentials,{ withCredentials: true })
      );
  }
 
  public deleteSubject(classNumber: any): Observable<any>{
    return (
      this.http.get<any>(
        this.baseUrl + 'deleteSubjectData/' + classNumber,{ withCredentials: true })
      );
  }
  
  public saveAlternative(idPerson: any, numberAlternatives: any): Observable<any>{
    return (
      this.http.get<any>(
        this.baseUrl + 'addAlternativeData/' + idPerson + '/' + numberAlternatives,{ withCredentials: true })
      );
  }

  public getUser(){
    return this.userToken;
  }


  public saveSubjectAlternative(idAlternative: any, classNumber: any): Observable<any>{
    return (
      this.http.get<any>(
        this.baseUrl + 'addSubjectAlternative/' + idAlternative + '/' + classNumber,{ withCredentials: true })
      );
  }




  /**
   * Guarda al usuario que ingresó a la aplicación
   * 
   * @param user Usuario que ingresó a la aplicación
   */
  public setUSer(user: User) {
    this.userToken = user;
  }
}
