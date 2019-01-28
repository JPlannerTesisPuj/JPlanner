import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDay } from 'date-fns';

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
  private classes: CalendarEvent[] = [
    {
      start: addHours(this.getDayInWeek(2), 7),
      end: addHours(this.getDayInWeek(2), 9),
      color: colors.black,
      title: 'Materia 1',
    },
    {
      start: addHours(this.getDayInWeek(4), 7),
      end: addHours(this.getDayInWeek(4), 9),
      color: colors.black,
      title: 'Materia 1',
    },
    {
      start: addHours(this.getDayInWeek(1), 14),
      end: addHours(this.getDayInWeek(1), 16),
      color: colors.black,
      title: 'Materia 2',
    },
    {
      start: addHours(this.getDayInWeek(3), 14),
      end: addHours(this.getDayInWeek(3), 16),
      color: colors.black,
      title: 'Materia 2',
    },
    {
      start: addHours(this.getDayInWeek(5), 7),
      end: addHours(this.getDayInWeek(5), 11),
      color: colors.black,
      title: 'Materia 3',
    },
    {
      start: addHours(this.getDayInWeek(1), 18),
      end: addHours(this.getDayInWeek(1), 20),
      color: colors.black,
      title: 'Materia 4',
    },
    {
      start: addHours(this.getDayInWeek(3), 18),
      end: addHours(this.getDayInWeek(3), 20),
      color: colors.black,
      title: 'Materia 4',
    },
    {
      start: addHours(this.getDayInWeek(5), 18),
      end: addHours(this.getDayInWeek(5), 20),
      color: colors.black,
      title: 'Materia 4',
    },
    {
      start: addHours(this.getDayInWeek(6), 8),
      end: addHours(this.getDayInWeek(6), 13),
      color: colors.black,
      title: 'Materia 5',
    },
    {
      start: addHours(this.getDayInWeek(0), 9),
      end: addHours(this.getDayInWeek(0), 11),
      color: colors.black,
      title: 'Materia 6',
    },
  ];

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

}
