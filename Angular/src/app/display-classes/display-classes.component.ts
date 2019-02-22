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
  @Input() calendarList: any;

  // Lista que tiene la información de las materias que se quieren visualizar
  private classes: Subject[];
  private filter: any;
  private error: string;

  private numberClasses: any;


  //Booleano para mostrar o esconder el loader  
  private showLoader: boolean;


  // Se pide la dependencia de ReadJsonFileService
  constructor(private readJSONFileService: ReadJsonFileService, private data: DataService) { }

  ngOnInit() {
    this.showLoader = false;

    //Supscripción a los mensajes
    this.data.currentMessage.subscribe(message => {
      //Reinicio arreglo y mensaje de error
      this.classes = [];
      this.error = '';
      this.filter = message;
      if (this.filter['type'] === 'filter') {

        this.readJSONFileService.filter('classes', this.filter).subscribe(classes => {
          //Pinta en el buscador las clases encontradas
          this.classes = classes;
          this.numberClasses = this.classes.length;
        });

        //Inicializa el loader cuando una busqueda es realizada
        this.showLoader = true;
        this.readJSONFileService.filter('classes', this.filter).subscribe(
          classes => {
            //Pinta en el buscador las clases encontradas
            this.classes = classes;
          },
          //Maneja un error en el observable (Por ejemplo si el servicio esta caido)
          error => {
            this.error = 'Se ha producido un error, intentelo nuevamente';
            this.showLoader = false;
          },
          //Esconde el loader cuando el observable finaliza
          () => {
            this.showLoader = false;
          }
        );

      }
    });
  }

  private dropInside(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
