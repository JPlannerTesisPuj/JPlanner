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
  private classes: Subject[] = [];
  private filter;
  private error;
  // Se pide la dependencia de ReadJsonFileService
  constructor(private readJSONFileService: ReadJsonFileService,private data: DataService) { }

  ngOnInit() {
    //Supscripción a los mensajes
    this.data.currentMessage.subscribe(message => {
      //Reinicio arreglo y mensaje de eror
      this.classes = [];
      this.error = "";
      this.filter=message;
      //Si el type del filtro es view all, invoca el metodo para leer todo el JSON
      if(this.filter['type']=='view all'){
        this.readJSONFileService.readJSONFile('classes')
        .subscribe(classes =>{
          this.printClasses(classes);
        }
        );

        //Si el filtro es de tipo filterHourDay, invoque el metodo con el filtro de horas y dias
      }else if(this.filter['type']=='filterHourDay'){
      this.readJSONFileService.filterClassesDayHour('classes',this.filter['days'],this.filter['hourFrom'],this.filter['hourTo'])
      .subscribe(classes =>{
        this.printClasses(classes);
      }
      );
    }
    });

  }

  //Imprime la lista de clases 
  printClasses(classes) {
    
        if(classes.length==0){
          this.error = "Ninguna clase cumple con sus parametros de busqueda";
        }else{
        // Se toma la información retornada por el servicio y se la reccore
        for (let key in classes) {

          // Se inicializa una lista de horarios para agregar a una materia
          let horaries: Horary[] = [];

          // Se recorren los horarios que tiene una materia y se los agrega a la lista
          for (let day in classes[key]['horarios']) {

            let newHorary: Horary;
            let auxDay = classes[key]['horarios'][day];

            // Esto se hace debido a que el nombre del día es el nombre del Objeto JSON y no una variable
            if (auxDay['Lunes'] !== 'undefined' && auxDay['Lunes'] != null && auxDay['Lunes'] !== null) {
              newHorary = new Horary('Lunes', auxDay['Lunes'][0], auxDay['Lunes'][1]);
            } else if (auxDay['Martes'] !== 'undefined' && auxDay['Martes'] != null && auxDay['Martes'] !== null) {
              newHorary = new Horary('Martes', auxDay['Martes'][0], auxDay['Martes'][1]);
            } else if (auxDay['Miercoles'] !== 'undefined' && auxDay['Miercoles'] != null && auxDay['Miercoles'] !== null) {
              newHorary = new Horary('Miercoles', auxDay['Miercoles'][0], auxDay['Miercoles'][1]);
            } else if (auxDay['Jueves'] !== 'undefined' && auxDay['Jueves'] != null && auxDay['Jueves'] !== null) {
              newHorary = new Horary('Jueves', auxDay['Jueves'][0], auxDay['Jueves'][1]);
            } else if (auxDay['Viernes'] !== 'undefined' && auxDay['Viernes'] != null && auxDay['Viernes'] !== null) {
              newHorary = new Horary('Viernes', auxDay['Viernes'][0], auxDay['Viernes'][1]);
            } else if (auxDay['Sabado'] !== 'undefined' && auxDay['Sabado'] != null && auxDay['Sabado'] !== null) {
              newHorary = new Horary('Sabado', auxDay['Sabado'][0], auxDay['Sabado'][1]);
            } else if (auxDay['Domingo'] !== 'undefined' && auxDay['Domingo'] != null && auxDay['Domingo'] !== null) {
              newHorary = new Horary('Domingo', auxDay['Domingo'][0], auxDay['Domingo'][1]);
            }

            // Se agrega el horario a la lista de horarios
            horaries.push(newHorary);

          }

          // Se añade una nueva materia a la lista de materia, tomando los datos que se encuentran en el JSON
          this.classes.push(new Subject(
            classes[key]['_id'],
            classes[key]['numeroClase'],
            classes[key]['nombre'],
            classes[key]['profesor'],
            classes[key]['creditos'],
            classes[key]['salon'],
            classes[key]['department'],
            horaries,
          ));
        }
      }
      }
}


