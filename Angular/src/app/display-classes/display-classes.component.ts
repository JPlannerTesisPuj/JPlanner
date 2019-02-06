import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { Subject } from '../shared/model/Subject';
import { Horary } from '../shared/model/Horary';
import { DataService } from '../shared/data.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

/**
 * Clase que actúa como controlador de la vista que desplega la información de una lista de materias.
 */
@Component({
  selector: 'app-display-classes',
  templateUrl: './display-classes.component.html'
})
export class DisplayClassesComponent implements OnInit {

  // Lista externa con la que la lista de clases estará relacionada
  @Input() calendarList;

  // Lista que tiene la información de las materias que se quieren visualizar
  private classes;
  private filter;
  private error;
  // Se pide la dependencia de ReadJsonFileService
  constructor(private readJSONFileService: ReadJsonFileService, private data: DataService) { }

  ngOnInit() {
    //Supscripción a los mensajes
    this.data.currentMessage.subscribe(message => {
      //Reinicio arreglo y mensaje de eror
      this.classes = [];
      this.error = "";
      this.filter = message;
      if (this.filter['type'] == 'filterUnificado') {
        console.log(this.filter);
        this.readJSONFileService.filterUnificado('classes', this.filter)
          .subscribe(classes => {
            this.classes = classes;
          });
      }
      else if (this.filter['type'] === 'adv-filter'){
        this.readJSONFileService.advFilter('classes',this.filter).subscribe(classes => {
          this.classes = classes;
        });
      }
    });
  }

  private dropInside(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

}

