import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDay } from 'date-fns';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from '../shared/model/Subject';
import { Subject as SubjectRXJS } from 'rxjs';
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
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {

  private view: CalendarView = CalendarView.Week;
  private calendarView = CalendarView; // Enum
  private viewDate: Date = new Date();

  // This variable contains the classes that will be displayed on the calendar
  // start: is the start Date (includes the day and the hour) of the day that the classes is taken
  // end: is the end Date (includes the day and the hour) of the day that the classes is taken
  // color: is the color that the class will be displayed with in the calendar
  // title: is the text that will be displayed inside the class box
  private classes: CalendarEvent[] = [];
  private refresh: SubjectRXJS<any> = new SubjectRXJS();

  constructor() { }

  ngOnInit() { }

  /**
   * Takes a day number in the week and gets what day could it be in the current week.
   * 
   * 0: Sunday
   * 1: Monday
   * 2: Tuesday
   * 3: Wednesday
   * 4: Thursday
   * 5: Friday
   * 6: Saturday
   * 
   * @param desiredDayNumber The desired day in number that we want to display in the calendar
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

  drop(event: CdkDragDrop<Subject[]>) {
    let subjectToDisplay: Subject = event.previousContainer.data[event.previousIndex];

    for (let horary of subjectToDisplay.horarios) {
      this.classes.push({
        start: addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaInicio/3600),
        end: addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaFin/3600),
        color: colors.black,
        title: subjectToDisplay.nombre,
      });
    }
    this.refresh.next();
  }

  private getDayNumberByName(name: string): number {
    let dayNumber: number = 0;

    if(name.toUpperCase() === 'domingo'.toUpperCase()) {
      return 0;
    } else if(name.toUpperCase() === 'lunes'.toUpperCase()) {
      return 1;
    } else if(name.toUpperCase() === 'martes'.toUpperCase()) {
      return 2;
    } else if(name.toUpperCase() === 'miércoles'.toUpperCase() || name.toUpperCase() === 'miercoles'.toUpperCase()) {
      return 3;
    } else if(name.toUpperCase() === 'jueves'.toUpperCase()) {
      return 4;
    } else if(name.toUpperCase() === 'viernes'.toUpperCase()) {
      return 5;
    } else if(name.toUpperCase() === 'sábado'.toUpperCase() || name.toUpperCase() === 'sabado'.toUpperCase()) {
      return 6;
    }

    return dayNumber;
  }

}
