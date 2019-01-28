import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../shared/model/Subject';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ClassModalComponent } from '../class-modal/class-modal.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-display-class',
  templateUrl: './display-class.component.html'
})
export class DisplayClassComponent implements OnInit {

  // Se solicita un objeto de tipo Subject como parámetro para invocar al componente
  @Input() private subject: Subject;

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  openDialog(subject) {
    let dialogRef = this.dialog.open(ClassModalComponent, {
      data: { class: subject }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(subject);
    });
  }

}
