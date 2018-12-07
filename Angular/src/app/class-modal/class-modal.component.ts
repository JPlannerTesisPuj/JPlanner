import { Component, OnInit,Inject,Input } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Subject } from '../shared/model/Subject';
@Component({
  selector: 'app-class-modal',
  templateUrl: './class-modal.component.html',
})
export class ClassModalComponent implements OnInit {

   private currentTime;
   private futureTime;
   private time;
  @Input() private subject: Subject;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.subject = data.class;
  }

  ngOnInit() {
   
  }

  msToHMS( ms ) : string{
    /*
    this.currentTime = new Date().getTime();
    this.futureTime = ms
    this.time = this.futureTime - this.currentTime;
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = seconds / 3600; // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes =  seconds / 60 ; // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    */
    return (ms/3600)+":00";
}


   

}
