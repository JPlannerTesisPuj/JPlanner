import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../shared/model/Subject';
import { DataService } from '../shared/data.service';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-display-subjects',
  templateUrl: './display-subjects.component.html'
})
export class DisplaySubjectsComponent implements OnInit {

  // Lista externa con la que la lista de clases estará relacionada
  @Input() calendarList: any;

  // Lista que tiene la información de todas las materias y las clases de esa materia
  private subjects: Map<string, Subject[]> = new Map<string, Subject[]>();

  // Arreglo donde se almacenara la lista de clases organizada alfabeticamente
  private sortedClasses: Array<Subject[]> = [];
  // Lista de clases de una materia seleccionada
  private classesToShow: Subject[] = [];
  private subjectNameToShow: string = '';
  private filter: any;
  private error: string;
  private showLoader: boolean;
  private showClasses: boolean = false;

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
        this.sortedClasses = [];

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
            if (this.sortedClasses.length == 0) {
              this.sortedClasses = Array.from(this.sortClasses());
            }
          }
        );
      }
    });
  }

  /** 
  * Metodo que retorna la lista de clases ordenada alfabeticamente 
  */
  private sortClasses() {
    let list = [];
    let idsArray = [];
    this.subjects.forEach((value, key, map) => {
      list.push({ 'id': key, 'name': value[0].nombre });
    });

    list.sort(function (a, b) {
      return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
    });

    for (var k = 0; k < list.length; k++) {
      idsArray[k] = list[k].id;
    }
    let sortedMap = new Map();
    idsArray.forEach(value => {
      sortedMap.set(value, this.subjects.get(value));
    });

    return sortedMap.values();
  }
  /**
   * Toma las clases de una materia que se van a mostrar
   * 
   * @param subjectClasses Clases a mostrar
   */
  private showSubjectClasses(subjectClasses: Subject[]) {
    this.classesToShow = subjectClasses;
    this.subjectNameToShow = subjectClasses[0].nombre;
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

}
