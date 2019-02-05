import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDay, areRangesOverlapping } from 'date-fns';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from '../shared/model/Subject';
import { Subject as SubjectRXJS } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ClassModalComponent } from '../class-modal/class-modal.component';
/**
 * The documentation used to develop this calendar was taken form https://www.npmjs.com/package/angular-calendar
 * and also https://mattlewis92.github.io/angular-calendar/#/kitchen-sink
 */

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  black: {
    primary: '#000000',
    secondary: '#dddddd'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html'
})

export class CalendarComponent implements OnInit {

  private view: CalendarView = CalendarView.Week;
  private calendarView = CalendarView; // Enum
  private viewDate: Date = new Date();
  private calendarClasses: Subject[] = [];

  /**
   * Esta variable contiene las clases que se mostrarán en el horario. Los atributos cada clase que se muestra son:
   * start: fecha de inicio de la materia, incluye la hora en que inicia la clase y el día de la semana en que se tomará.
   * end: fecha de fin de la materia, incluye la hora en que finaliza la clase y el día de la semana en que se tomará.
   * color: es el color con el que se pintará la materia en el horario.
   * title: es el título de la clase que aparecerá en el bloque del horario de la materia
   */
  private classes: CalendarEvent[] = [];
  private refresh: SubjectRXJS<any> = new SubjectRXJS();
 
  private actions: CalendarEventAction[] = [
    {
      label: '<i class="material-icons remove-icon"> clear </i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Removed', event);
      }
    },
  ];

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  /**
   * Toma el número de un día en la semana y obtiene la fecha de ese día en la semana actual.
   * 
   * 0: Domingo
   * 1: Lunes
   * 2: Martes
   * 3: Miércoles
   * 4: Jueves
   * 5: Viernes
   * 6: Sábado
   * 
   * @param desiredDayNumber El número del día deseado que se desea mostrar en el horario.
   */
  private getDayInWeek(desiredDayNumber: number): Date {
    let desiredDay: Date = new Date();
    let currentDayNumber: number = getDay(desiredDay);
    let daysOfDifference: number = 0;

    if (currentDayNumber > desiredDayNumber) {
      daysOfDifference = currentDayNumber - desiredDayNumber;
      desiredDay = subDays(startOfDay(new Date()), daysOfDifference);
    } else if (currentDayNumber < desiredDayNumber) {
      daysOfDifference = desiredDayNumber - currentDayNumber;
      desiredDay = addDays(startOfDay(new Date()), daysOfDifference);
    } else {
      desiredDay = startOfDay(new Date())
    }

    return desiredDay;
  }

  /**
   * Reacciona al evento de soltar un elemento dentro del Horario, tomando la información de la materia
   * que se desea agregar al calenario y guardándola en un arreglo que contiene la información de todas las materias
   * del horario.
   * 
   * @param event Evento de soltar una materia en el Horario
   */
  private dropClass(event: CdkDragDrop<Subject[]>) {
    let subjectToDisplay: Subject = event.previousContainer.data[event.previousIndex];

    // Mira si la clase no ha sido agregada al horario
    if (!this.calendarClasses.some(myClass => myClass._id === subjectToDisplay._id)) {
      let isOverlapped: boolean = false;
      let newClasses: CalendarEvent[];
      newClasses = Object.assign([],this.classes);

      for (let horary of subjectToDisplay.horarios) {
        let startHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaInicio / 3600);
        let endHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaFin / 3600);
        isOverlapped = this.checkOverlappingClasses(startHour, endHour);

        // Si la clase no se cruza con ninguna materia la guarda en un arreglo auxiliar de clases
        if(isOverlapped) {
          break;
        } else {
          newClasses.push({
            start: startHour,
            end: endHour,
            color: colors.black,
            title: subjectToDisplay.nombre,
            id: subjectToDisplay._id,
            actions : this.actions
          });
        }
      }

      // Si ninguna materia se cruzó entonces iguala el arreglo de las clases al arreglo de las nuevas clases
      if (!isOverlapped) {
        this.classes = newClasses;
        this.calendarClasses.push(subjectToDisplay);
        this.refresh.next();
      }
    }
  }

  /**
   * Mira si la materia nueva que se agregará al horario se cruza con las otras materias
   * 
   * @param startHour Hora de inicio
   * @param endHour Hora de fin
   */
  private checkOverlappingClasses(startHour: Date, endHour: Date) {
    return this.classes.some(function (myClass) {
      return areRangesOverlapping(startHour, endHour, myClass.start, myClass.end);
    });
  }

  /**
   * Toma el nombre de un día de la semana y retorna el número equivalente al día de la semana.
   * 
   * @param name Nombre del día de la semana
   */
  private getDayNumberByName(name: string): number {
    let dayNumber: number = 0;

    if (name.toUpperCase() === 'domingo'.toUpperCase()) {
      return 0;
    } else if (name.toUpperCase() === 'lunes'.toUpperCase()) {
      return 1;
    } else if (name.toUpperCase() === 'martes'.toUpperCase()) {
      return 2;
    } else if (name.toUpperCase() === 'miércoles'.toUpperCase() || name.toUpperCase() === 'miercoles'.toUpperCase()) {
      return 3;
    } else if (name.toUpperCase() === 'jueves'.toUpperCase()) {
      return 4;
    } else if (name.toUpperCase() === 'viernes'.toUpperCase()) {
      return 5;
    } else if (name.toUpperCase() === 'sábado'.toUpperCase() || name.toUpperCase() === 'sabado'.toUpperCase()) {
      return 6;
    }

    return dayNumber;
  }

  /**
   * Maneja los eventos dentro de el horario
   * 
   * @param action Acción a la cual se va a responder
   * @param event Evento al cual se está respondiendo
   */
  private handleEvent(action: string, event: CalendarEvent): void {

    if(action === 'Clicked'){
      let subjectToShowthis: Subject = this.calendarClasses.find(myClass => myClass._id === event.id);
      let dialogRef = this.dialog.open(ClassModalComponent, {
        data: { class: subjectToShowthis }
      });
    }
    else if(action === 'Removed'){
      this.removeClass(event.id);
    }
  }

  private removeClass(id){
    let newClasses: CalendarEvent[] ;
    newClasses = Object.assign([],this.classes);
    newClasses = newClasses.filter(subject => subject.id != id);
    this.classes = newClasses;
    this.calendarClasses = this.calendarClasses.filter(subject => subject._id != id);
    this.refresh.next();
  }
  

}
