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

  //Envias los datos
  addBlock(){
    console.log("emitiendo");
    this.message = 'Master';
    this.messageEvent.emit("holis");
  }

}
