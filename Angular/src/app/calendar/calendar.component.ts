import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';

/**
 * The documentation used to develop this calendar was taken form https://www.npmjs.com/package/angular-calendar
 * and also https://mattlewis92.github.io/angular-calendar/#/kitchen-sink
 */

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Day;
  calendarView = CalendarView; // Enum
  viewDate: Date = new Date();
  daysito: string;

  constructor() { }

  ngOnInit() { 
    this.daysito = this.viewDate.getDay() + '';
    
  }

}
