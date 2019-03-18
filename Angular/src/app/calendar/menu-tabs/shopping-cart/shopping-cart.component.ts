import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Subject } from '../../../shared/model/Subject';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent implements OnInit {

  @Input() private altTitle: String;
  @Input() private classes: Subject[];
  constructor() { }

  ngOnInit() {
   
  }

    private titleCaseWord(word: string) {
    if (!word) {
      return word;
    }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

}
