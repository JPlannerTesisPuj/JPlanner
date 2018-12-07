import { Component, OnInit } from '@angular/core';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { Subject } from '../shared/model/Subject';
import { Horary } from '../shared/model/Horary';
import { DataService } from '../shared/data.service';

/**
 * Clase que actúa como controlador de la vista que desplega la información de una lista de materias.
 */
@Component({
  selector: 'app-display-classes',
  templateUrl: './display-classes.component.html'
})
export class DisplayClassesComponent implements OnInit {



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
      //Si el type del filtro es view all, invoca el metodo para leer todo el JSON
      if (this.filter['type'] == 'view all') {
        this.readJSONFileService.readJSONFile('classes')
          .subscribe(classes => {
           this.classes = classes;
          }
          );

        //Si el filtro es de tipo filterHourDay, invoque el metodo con el filtro de horas y dias
      } else if (this.filter['type'] == 'filterHourDay') {
        this.readJSONFileService.filterClassesDayHour('classes', this.filter['days'], this.filter['hourFrom'], this.filter['hourTo'])
          .subscribe(classes => {
            this.classes = classes;
          });
      } else if (this.filter['type'] == 'filterCredits') {
        console.log(this.filter);
        this.readJSONFileService.filterClassesCredits('classes', this.filter['credit1Value'], this.filter['operator'], this.filter['credit2Value'])
          .subscribe(classes => {
            this.classes = classes;
          });
      }
    });

  }



}

