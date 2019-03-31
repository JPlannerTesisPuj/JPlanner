import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../shared/model/Subject';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ClassModalComponent } from '../class-modal/class-modal.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { addDays, getDay } from 'date-fns';
import { Horary } from '../shared/model/Horary';

@Component({
  selector: 'app-display-class',
  templateUrl: './display-class.component.html'
})
export class DisplayClassComponent implements OnInit {

  // Se solicita un objeto de tipo Subject como parámetro para invocar al componente
  @Input() private subject: Subject;
  private locale: string = 'es';

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  private openDialog(subject: Subject) {
    let dialogRef: any = this.dialog.open(ClassModalComponent, {
      data: { class: subject }
    });
  }

  private weekHoraries(horaries: Horary[]): Map<number, Date[]> {
    let weekHours: Map<number, Date[]> = new Map<number, Date[]>();

    horaries.forEach(horary => {
      if (!weekHours.has(getDay(horary.horaInicio))) {
        weekHours.set(getDay(horary.horaInicio), [new Date(horary.horaInicio), new Date(horary.horaFin)]);
      }
    });

    return weekHours;
  }

}
