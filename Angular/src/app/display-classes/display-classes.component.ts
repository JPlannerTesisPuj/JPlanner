import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { Subject } from '../shared/model/Subject';
import { Horary } from '../shared/model/Horary';
import { DataService } from '../shared/data.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CalendarEvent } from 'calendar-utils';
import { areRangesOverlapping } from 'date-fns';
import { forEach } from '@angular/router/src/utils/collection';
import { CalendarBlock } from '../shared/model/CalendarBlock';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

/**
 * Clase que actúa como controlador de la vista que desplega la información de una lista de materias.
 */
@Component({
  selector: 'app-display-classes',
  templateUrl: './display-classes.component.html'
})
export class DisplayClassesComponent implements OnInit {

  // Lista externa con la que la lista de clases estará relacionada
  @Input() calendarList: any;

  // Lista que tiene la información de las materias que se quieren visualizar
  @Input() classes: Subject[];
  private filter: any;
  private error: string;

  private numberClasses: any;
  //Emite el evento para agregar una materia
  @Output() addSubjetEmit = new EventEmitter<Subject>();

  //Booleano para mostrar o esconder el loader  
  private showLoader: boolean;


  // Se pide la dependencia de ReadJsonFileService
  constructor() { }

  ngOnInit() { }

  private dropInside(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  /**
   * 
   * @param subject Materia que se agregara
   */
  private addSubj(subject){
    this.addSubjetEmit.next(subject);
  }
}
