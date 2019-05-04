import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-autocomplete-horary',
  templateUrl: './autocomplete-horary.component.html'
})
export class AutocompleteHoraryComponent implements OnInit {

  private classesMap = new Map();
  private autocompleteHorarySelectedItems: string;
  private dropdownListClasses = [];
  private dropdownSettings = {};

  constructor() { 
    //Opciones de configuración del dropdown
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: true,
      itemsShowLimit: 7,
      allowSearchFilter: false,
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Remover Todos'
    };

    this.classesMap.forEach(function(subject, idSubject) {
      this.dropdownListClasses.push({item_id: idSubject, item_text: subject.nombre});
    });
  }

  ngOnInit() {
  }

}
