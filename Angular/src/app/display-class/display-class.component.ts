import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../shared/model/Subject';

@Component({
  selector: 'app-display-class',
  templateUrl: './display-class.component.html',
  styleUrls: ['./display-class.component.css']
})
export class DisplayClassComponent implements OnInit {

  // Se solicita un objeto de tipo Subject como parámetro para invocar al componente
  @Input() private subject: Subject;

  constructor() { }

  ngOnInit() {
  }

}
