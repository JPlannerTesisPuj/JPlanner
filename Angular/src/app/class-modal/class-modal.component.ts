import { Component, OnInit, Inject, Input, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from '../shared/model/Subject';
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


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.subject = data.class;
  }

  ngOnInit() { 
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
  private colorStatus(input: string){
    let colorStatusObject:any = document.getElementsByClassName('cls-mod-elements-line status');
    var i = 0;

    if(input == "abierta"){
      colorStatusObject[i].style.color= '#50ac31';
      this.showCircle = true;
      this.showRectangle = false;
    } else if(input == "cerrada"){
      colorStatusObject[i].style.color= '#ec660c';
      this.showCircle = false;
      this.showRectangle = true;
    }
    return input;
  }


}
