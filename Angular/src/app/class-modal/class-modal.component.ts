import { Component, OnInit, Inject, Input, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from '../shared/model/Subject';
import { Horary } from '../shared/model/Horary';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-class-modal',
  templateUrl: './class-modal.component.html',
})
export class ClassModalComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 768) { // 768px portrait
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  @Input() private subject: Subject;

  private isMobile = false;
  private showCircle: boolean;
  private showRectangle: boolean;

  private paginatedHoraries;
  private currentHoraryPage;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.subject = data.class;
  }

  ngOnInit() {
    this.currentHoraryPage = 0;
    this.subject.horarios.sort((a, b) => (a.horaInicio > b.horaInicio) ? 1 : ((b.horaInicio > a.horaInicio) ? -1 : 0));
    this.paginatedHoraries = this.divideByWeek();
    if (window.screen.width <= 768) { // 768px portrait
      this.isMobile = true;
    }
  }

  /**
   * Convierte na hora en milisegundos a un string en formano hh:mm
   * 
   * @param ms Milisegundos
   * @returns Hora en texto
   */
  private textToDate(dateText: string | number): Date {
    return new Date(dateText);
  }

  /**
   * Esta función convierte el color según el estado de la materia
   * 
   * @param input Estado de la materia
   */
  private colorStatus(input: string) {
    let colorStatusObject: any = document.getElementsByClassName('cls-mod-elements-line status');
    var i = 0;

    if (input == "abierta") {
      colorStatusObject[i].style.color = '#50ac31';
      this.showCircle = true;
      this.showRectangle = false;
    } else if (input == "cerrada") {
      colorStatusObject[i].style.color = '#ec660c';
      this.showCircle = false;
      this.showRectangle = true;
    }
    return input;
  }

  private divideByWeek() {
    let weeksInSemester = new Map();
    for (let horary of this.subject.horarios) {
      let arr;
      if (weeksInSemester.has(this.getWeekNumber(horary))) {
        arr = weeksInSemester.get(this.getWeekNumber(horary));
      } else {
        arr = new Array();
      }
      arr.push(horary);
      weeksInSemester.set(this.getWeekNumber(horary), arr);
    }
    let splittedHoraries = [];
    weeksInSemester.forEach(value => splittedHoraries.push(value));

    return (splittedHoraries);

  }

  private getWeekNumber(horary: Horary) {
    let d: any = this.textToDate(horary.horaInicio);
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    let yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return (weekNo);
  }

  private pageChanged(page){
    this.currentHoraryPage = page;
  }
}
