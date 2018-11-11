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

}
