import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from '../shared/model/Subject';
@Component({
  selector: 'app-class-modal',
  templateUrl: './class-modal.component.html',
})
export class ClassModalComponent implements OnInit {

  @Input() private subject: Subject;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.subject = data.class;
  }

  ngOnInit() { }

  /**
   * Convierte na hora en milisegundos a un string en formano hh:mm
   * 
   * @param ms Milisegundos
   * @returns Hora en texto
   */
  private textToDate(dateText: string): Date {
    return new Date(dateText);
  }




}
