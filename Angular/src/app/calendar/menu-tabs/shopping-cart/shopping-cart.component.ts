import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Subject } from '../../../shared/model/Subject';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent implements OnInit {

  @Input() private conflict: boolean;
  @Input() private altTitle: String;
  @Input() private classes: Subject[];
  @Output() removeSubject = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
   
  }

  private removeClass(id){
    this.removeSubject.next(id);
  } 
  
    private titleCaseWord(word: string) {
    if (!word) {
      return word;
    }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

}
