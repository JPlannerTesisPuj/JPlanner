import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../shared/model/Subject';
import { DataService } from '../shared/data.service';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { stringify } from 'querystring';
import { CalendarBlock } from '../shared/model/CalendarBlock';
import { areRangesOverlapping } from 'date-fns';

@Component({
  selector: 'app-display-subjects',
  templateUrl: './display-subjects.component.html',
})
export class DisplaySubjectsComponent implements OnInit {

  // Lista externa con la que la lista de clases estará relacionada
  @Input() calendarList: any;

  // Lista que tiene la información de todas las materias y las clases de esa materia
  private subjects: Map<string, Subject[]> = new Map<string, Subject[]>();
  // Lista de clases de una materia seleccionada
  private classesToShow: Subject[] = [];
  private subjectNameToShow: string = '';
  private filter: any;
  private error: string;
  private showLoader: boolean;
  private showClasses: boolean = false;

  // Lista que tiene todos los bloqueos actuales del calendario (alternativa seleccionada)
  @Input() calendarBlocks: CalendarBlock[];

  // Lista de clases que no se cruzan con los horarios de los bloqueos
  private notOverLappedClasses: Subject[] = [];

  constructor(
    private readJSONFileService: ReadJsonFileService,
    private data: DataService
  ) { }

  ngOnInit() {
    this.showLoader = false;
    // Suscripción al envío de mensajes
    this.data.currentMessage.subscribe(message => {
      // Reinicio arreglo y mensaje de error
      this.subjects = new Map<string, Subject[]>();
      this.error = '';
      this.filter = message;
      this.backToResults();

      if (this.filter['type'] === 'filter') {
        // Inicializa el loader cuando la búsqueda es realizada
        this.showLoader = true;

        this.readJSONFileService.filter('classes', this.filter).subscribe(
          allClasses => {
            allClasses.forEach(oneClass => {

              if (!this.subjects.has(oneClass.idCurso)) {
                let subjectArray: Subject[] = [];
                subjectArray.push(oneClass);
                this.subjects.set(oneClass.idCurso, subjectArray);
              } else {
                this.subjects.get(oneClass.idCurso).push(oneClass);
              }
            })
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

  /**
   * Toma las clases de una materia que se van a mostrar
   * 
   * @param subjectClasses Clases a mostrar
   */
  private showSubjectClasses(subjectClasses: Subject[]) {

    this.notOverLappedClasses = [];
    this.getNotOverlappedClasses(subjectClasses);
    this.classesToShow = this.notOverLappedClasses;
    if(this.notOverLappedClasses.length == 0){
      this.subjectNameToShow = "No hay clases disponibles";
    } else {
      this.subjectNameToShow = this.notOverLappedClasses[0].nombre;
    }
    this.showClasses = true;
  }

  /**
   * Vuelve a la lista de resultados de búsqueda
   */
  private backToResults() {
    this.classesToShow = [];
    this.subjectNameToShow = '';
    this.showClasses = false;
  }

  /**
   * Mira si las materias de la busqueda se cruzan con los horarios de los bloqueos
   * 
   * @param subjectClasses Arreglo de clases de la materia seleccionada
   * 
   * Retorna una lista de clases que no se cruzan con los horarios de los bloqueos
   */
  private getNotOverlappedClasses(subjectClasses: Subject[]) {

    let alreadyInArray: boolean;
    let overLapped: boolean;

    subjectClasses.forEach(myClass => {

      overLapped = false;

      this.calendarBlocks.forEach(blocking => {
        myClass.horarios.forEach(horary => {

          if(areRangesOverlapping(blocking.startHour, blocking.endHour, horary.horaInicio, horary.horaFin))
            overLapped = true; 

        });
      });

      if(!overLapped)
        this.notOverLappedClasses.push(myClass);

    });

  }

}
