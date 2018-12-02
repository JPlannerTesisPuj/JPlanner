import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
/*
Servicio Utilizado para enviar mensajes a través de coponentes hermanos
*/

export class DataService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message) {
    this.messageSource.next(message)
  }

}