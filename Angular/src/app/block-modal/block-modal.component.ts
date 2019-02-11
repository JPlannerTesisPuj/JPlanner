import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-block-modal',
  templateUrl: './block-modal.component.html',
})
export class BlockModalComponent implements OnInit {

  message;
  constructor() { }

  ngOnInit() {
  }

  @Output() messageEvent = new EventEmitter<string>();

  //Envias los datos del modal al calendar
  addBlock(){
    this.message = 'Master';
    this.messageEvent.emit("holis");
  }

}
