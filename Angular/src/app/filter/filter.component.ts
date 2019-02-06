import { Component, OnInit } from '@angular/core';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { DataService } from '../shared/data.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
})


export class FilterComponent implements OnInit {
  private dropdownListWeek = [];
  private dropdownListSearch = [];
  private selectedItemsWeek = [];
  private selectedItemsSearch = [];
  private dropdownSettings = {};
  private hoursFrom = [];
  private hoursTo = [];
  private selectedOptionFrom = "";
  private selectedOptionTo = "";
  private creditsComparatorOptions = {};
  private creditsComparator: any;
  private filterMsj;
  private searchBox: string;
  private creditValue;
  private creditValue2;
  errorCreditos: boolean = false;
  

  constructor(private readJSONFileService: ReadJsonFileService, private data: DataService) { }

  ngOnInit() {
    this.creditsComparator = '';
    this.creditValue = 1;
    this.creditValue2 = 2;
    //Subscripcion para recbir mensajes
    this.data.currentMessage.subscribe(message => this.filterMsj = message);

    this.dropdownListSearch = [
      'Nombre de Asignatura', 'Profesor', 'Departamento'
    ];
    this.dropdownListWeek = [
      'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'
    ];
    this.creditsComparatorOptions = { 1: "Mayor a", 2: "Menor a", 3: "Igual a", 4: "Entre" };

    //Opciones de configruacion del dropdwn
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
    this.initHoursFrom();
  }

  filterUnificado() {

    var data = {
      "type": "filterUnificado",
      "days": "none",
      "operator": this.creditsComparator.key,
      "infoSearch": "none",
      "dropdownInfo": "none"
    }

    if (this.validate()) {

      //Convierte el arreglo de dias a un string separado con -
      var days = this.selectedItemsWeek.toString().replace(/,/g, '-');

      // Convierte la hora a long
      var hmsFrom = this.selectedOptionFrom + ":00";
      var splittedFrom = hmsFrom.split(':');
      var secondsFrom = (+splittedFrom[0]) * 60 * 60 + (+splittedFrom[1]) * 60 + (+splittedFrom[2]);

      //Convierte la hora a long
      var hmsTo = this.selectedOptionTo + ":00";
      var splittedTo = hmsTo.split(':');
      var secondsTo = (+splittedTo[0]) * 60 * 60 + (+splittedTo[1]) * 60 + (+splittedTo[2]);

      data["days"] = days;
      data["hourFrom"] = secondsFrom;
      data["hourTo"] = secondsTo;
      
    }else{
      data["hourFrom"] = '0';
      data["hourTo"] = '0';
    }

     
    if (this.creditsComparator.key === undefined) {
      //alert("Elija un comparador de creditos");
      data["operator"] = '0';
      data["credit1Value"] = '-1';
      data["credit2Value"] = '-1';
    } else if (this.creditsComparator.key == 4) {
      data["credit1Value"] = Number(this.creditValue);
      data["credit2Value"] = Number(this.creditValue2);
      this.data.changeMessage(data);
      console.log
      if(this.creditValue2 == '' || this.creditValue == ''){
        this.errorCreditos = true;
        //alert("Porfavor escriba el número de creditos");
        
         
      }
    } else if (this.creditValue2 == '') {
        
         this.errorCreditos = true;
         //alert("Porfavor escriba el número de creditos");
    }else{
       this.errorCreditos = true;
      data["credit1Value"] = null;
      data["credit2Value"] = Number(this.creditValue2);
    }

    if(this.validateSearchBox()){

      var selectedDropdown = this.selectedItemsSearch.toString().replace(/,/g, '-');

      data["infoSearch"] = this.searchBox;
      data["dropdownInfo"] = selectedDropdown;
    } 

    this.data.changeMessage(data);

  }

  validate() {
    if (this.selectedOptionFrom == '' && this.selectedItemsWeek.length == 0) {
      //alert('Por favor eliga una opcion de filtro');
      return false;
    }
    else if (this.selectedOptionTo == '' && this.selectedOptionFrom != '') {
      //alert('Por favor eliga una franja horaria');
      return false;
    }

    return true;
  }
  initHoursFrom() {
    for (let i = 7; i <= 21; ++i) {
      this.hoursFrom.push(i + ':00');
    }
  }

  onChangeFromHour(item: any) {
    var hour = document.getElementById('hourTo');
    hour.style.display = 'inline-block'
    this.changeHoursTo(item);
  }

  onChangeFromCredit(item: any) {
    var credit1 = document.getElementById('credit-input-1');
    var credit2 = document.getElementById('credit-input-2');
    if (item.key != 4) {
      credit1.style.display = 'none'
      credit2.style.display = 'inline-block'
    } else if (item.key == 4) {
      credit1.style.display = 'inline-block'
      credit2.style.display = 'inline-block'
    }
  }

  changeHoursTo(item) {
    this.hoursTo = [];
    var numberItem = item.substring(0, item.indexOf(':'));
    numberItem++;
    for (let i = numberItem; i <= 22; ++i) {
      this.hoursTo.push(i + ':00');
    }
  }

  onChangeInputCreditOne(item: any) {
    if (item != '') {
      if (item >= 19)
        this.creditValue = 19
      if (this.creditValue + 1 > 19) {
        if (this.creditValue >= this.creditValue2) {
          this.creditValue2 = +this.creditValue + 1;
        }
      }
    }
  }
  onChangeInputCreditTwo(item: any) {
    if (item != '') {
      if (item <= 0)
        this.creditValue2 = 2;
      if (item >= 21)
        this.creditValue2 = 20;
      if (this.creditValue - 1 > 0) {
        if (this.creditValue2 <= this.creditValue) {
          this.creditValue = (this.creditValue2) - 1;
        }
      }
    }
  }
  validateSearchBox(){
    var ret = true;
    var errorMsg ;

    if(this.searchBox !== undefined){
      if(this.searchBox.length <3){
        ret = false;
        errorMsg = '<p>Digite por lo menos 3 carácteres</p>'
      }
      if(this.searchBox.charAt(0).match(/[a-z]/i) == null){
        ret = false;
        errorMsg = '<p>No inicie su busqueda por un carácter especial</p>'
      }
    }
      var err = document.getElementById('error-searchBox');
      if(!ret){
        err.style.visibility = 'visible'
        err.innerHTML = errorMsg;
      }else{
        err.style.visibility = 'hidden'
      }

    return ret;
  }

}
