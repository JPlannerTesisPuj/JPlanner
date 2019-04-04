import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from '../model/Subject';
import { BinaryOperator } from '@angular/compiler';
import { User } from '../model/User';
import { Usuario } from '../model/rest/Usuario';
import { Materia } from '../model/rest/Materia';
import { CalendarBlock } from '../model/CalendarBlock';
import { Bloqueo } from '../model/rest/Bloqueo';
import { BloqueoKey } from '../model/rest/keys/BloqueoKey';
import { AlternativaKey } from '../model/rest/keys/AlternativaKey';

/**
 * Permite consumir servicios externos para leer archivos JSON
 */
@Injectable({
  providedIn: 'root'
})

export class ReadJsonFileService {
  // URL base a donde se harán las peticiones
  private baseUrl: string = 'http://10.34.1.47:8080/';
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

  /**
   * Servicio que guarda una materia en la base de datos
   * 
   * @param classNumber numero de clase, primary key
   * @param name nombre de la clase
   */
  public saveAlternativeSubject(alternativeNumber: number, subjectToAdd: Materia): Observable<any> {
    return (
      this.http.post<any>(
        this.baseUrl + 'rest/addAlternativeSubject/' + alternativeNumber + '/' + this.userToken.GID,
        subjectToAdd,
        { withCredentials: true }
      )
    );
    // this.http.get<any>(
    //   this.baseUrl + 'putSubjectData/' + classNumber + '/' + name, { withCredentials: true })
  }

  /**
  * Servicio que guarda el usuario autenticado en la base de datos
  * 
  * @param idPerson id del usuario, primary key
  * @param credentials token jwt
  */
  public saveUser(idPerson: any, credentials: string): Observable<any> {
    return (
      this.http.post<any>(
        this.baseUrl + 'rest/addUser',
        new Usuario(idPerson, credentials, []),
        { withCredentials: true }
      ));
    // this.http.get<any>(
    //   this.baseUrl + 'rest/addUser' + idPerson +'/'+credentials,{ withCredentials: true })
    // );
  }

  /**
  * Servicio que borra la materia en la base de datos
  * 
  * @param classNumber numero de clase, primary key
  */
  public deleteAlternativeSubject(alternativeNumber: number, subjectToDelete: Materia): Observable<any> {
    return (
      this.http.post<any>(
        this.baseUrl + 'rest/deleteAlternativeSubject/' + alternativeNumber + '/' + this.userToken.GID,
        subjectToDelete,
        { withCredentials: true })
    );
  }

  /**
  * Servicio que guarda los bloqueos en la base de datos
  * @param addBlock idBlock, primary key del bloqueo
  * @param idAlternative idAlternative, foreign key referencia a la alternativa
  */
  public addBlock(blockToAdd: CalendarBlock, idAlternative: number): Observable<any> {
    return (
      this.http.post<any>(
        this.baseUrl + 'rest/addBlock',
        new Bloqueo(
          new BloqueoKey(
            blockToAdd.id,
            new AlternativaKey(
              idAlternative,
              this.userToken.GID
            )
          ),
          blockToAdd.startHour.getTime(),
          blockToAdd.endHour.getTime(),
          blockToAdd.name,
          blockToAdd.parentID,
          blockToAdd.dayID
        ),
        { withCredentials: true })
    );
  }

  /**
   * Servicio que elimina los bloqueos en la base de datos
   * @param addBlock idBlock, primary key del bloqueo
   */
  public deleteBlock(blockToAdd: CalendarBlock, idAlternative: number): Observable<any> {
    return (
      this.http.post<any>(
        this.baseUrl + 'rest/deleteBlock',
        new Bloqueo(
          new BloqueoKey(
            blockToAdd.id,
            new AlternativaKey(
              idAlternative,
              this.userToken.GID
            )
          ),
          blockToAdd.startHour.getTime(),
          blockToAdd.endHour.getTime(),
          blockToAdd.name,
          blockToAdd.parentID,
          blockToAdd.dayID
        ),{ withCredentials: true })
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

  /*
  * Función que permite consumir el servicio de ciclo lectivo actual y retorna
  * la fecha leida
  */
  public consumeLectiveCycle() {
    return new Date('2019/1/20 00:00:00');

  }

  /**
   * 
   * @param classNumber Id del numero de clase que se consultara
   * Retorna un observable con la información del numero nuevo de cupos disponibles en la clase
   */
  public checkClassSize(classNumber: string | number): Observable<number> {
    return (
      this.http.get<any>(
        this.baseUrl + 'updateClassSize/' + classNumber, { withCredentials: true })
    );
  }
}
