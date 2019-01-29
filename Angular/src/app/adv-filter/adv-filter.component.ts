import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-adv-filter',
  templateUrl: './adv-filter.component.html'
})
export class AdvFilterComponent implements OnInit {

  //Variables para filtro de modo de enseñanza
  private teachingModeDropdown;
  private selectedTeachingMode;
  private defaultTeachingMode;


  //Variables filtro estado
  private openStateCheckbox;
  private closedStateCheckbox;

  //Variables filtro ID
  private searchedFilterId;

  //Variables filtro numero
  private searchedFilterNumber;

  //Variables filtro codigo
  private searchedFilterCode;

  //Variables filtro de ciclo lectivo
  private year;
  private dropdownSchoolYear;

  //Variables filtro grado
  private gradeFilter;
  private dropdownGrades;

  //Variables filtro creditos
  private sizeComparatorOptions;
  private sizeComparator;
  private sizeValue1;
  private sizeValue2;

  //Mensaje con los datos de los filtros
  private filterMsj;

  constructor(private data: DataService) { }

  ngOnInit() {

    this.sizeComparatorOptions = { 1: "Mayor a", 2: "Menor a", 3: "Igual a", 4: "Entre" };

    this.teachingModeDropdown = [
      {
        name: 'Presencial',
        value: 'attendance',
      },
      {
        name: 'Virtual',
        value: 'virtual',
      },
    ];

    this.defaultTeachingMode = 'Cualquiera';
    this.selectedTeachingMode = this.defaultTeachingMode;
    this.sizeComparator = this.defaultTeachingMode;
    this.year = this.defaultTeachingMode;
    this.gradeFilter = this.defaultTeachingMode;

    this.openStateCheckbox = {
      id: "open-state-checkbox",
      name: 'Abierta',
      isChecked: false,
    }
    this.closedStateCheckbox = {
      id: 'closed-state-checkbox',
      name: 'Cerrada',
      isChecked: false,
    }

    this.searchedFilterId = '';
    this.searchedFilterNumber = '';
    this.searchedFilterCode = '';


    this.sizeValue1 = 1;
    this.sizeValue2 = 1;

    this.dropdownSchoolYear = [];
    this.schoolYear();

    this.dropdownGrades = [
      {
        name: 'Pregrado',
        value: 'pre'
      },
      {
        name: 'Postgrado',
        value: 'post'
      },
      {
        name: 'Maestría',
        value: 'master'
      }
    ];

    //Subscripcion para recbir mensajes 
    this.data.currentMessage.subscribe(message => this.filterMsj = message);
  }


  /** 
   * Llena dinamicamente el arreglo del dropdown con los ciclos lectivos.
  */
  schoolYear() {
    var currentdate = new Date();
    var fullYear = currentdate.getFullYear();
    var actualCycle;
    if (currentdate.getMonth() < 6) {
      actualCycle = 1;
    }
    else if (currentdate.getMonth() == 6) {
      if (currentdate.getDate() > 16) {
        actualCycle = 2;
      }
      else {
        actualCycle = 1;
      }
    }
    else if (currentdate.getMonth() == 7) {
      if (currentdate.getDate() < 14) {
        actualCycle = 2;
      }
      else {
        actualCycle = 3;
      }
    }
    else if (currentdate.getMonth() >= 8) {
      actualCycle = 3;
    }
    var yearActualCycle = fullYear + "-" + actualCycle
    this.dropdownSchoolYear.push(yearActualCycle);
    var yearMajor1Cycle = this.yearMajor(fullYear, actualCycle);
    this.dropdownSchoolYear.push(yearMajor1Cycle);
    var yearMajor2Cycle = this.yearMajor(+yearMajor1Cycle.split("-")[0], +yearMajor1Cycle.split("-")[1]);
    this.dropdownSchoolYear.push(yearMajor2Cycle);
    var yearMinor1Cycle = this.yearMinor(fullYear, actualCycle);
    this.dropdownSchoolYear.push(yearMinor1Cycle);
    var yearMinor2Cycle = this.yearMinor(+yearMinor1Cycle.split("-")[0], +yearMinor1Cycle.split("-")[1]);
    this.dropdownSchoolYear.push(yearMinor2Cycle);

    this.dropdownSchoolYear.sort();
  }
  yearMajor(year, cycle) {
    var newCycle = cycle + 1;
    var auxYear = year;

    if (newCycle == 3) {
      return auxYear + "-" + newCycle;
    }
    else if (newCycle == 2) {
      return auxYear + "-" + newCycle;
    }
    else if (newCycle == 4) {
      newCycle = 1;
      auxYear = auxYear + 1;
      return auxYear + "-" + newCycle;
    }
  }

  yearMinor(year, cycle) {
    var newCycle = cycle - 1;
    var auxYear = year

    if (newCycle == 0) {
      newCycle = 3
      auxYear = auxYear - 1
      return auxYear + "-" + newCycle;
    }
    else if (newCycle == 2) {
      return auxYear + "-" + newCycle;
    }
    else if (newCycle == 1) {
      return auxYear + "-" + newCycle;
    }

  }

  /**
   * Retorna el parametro del estado seleccionado para el filtro
   */
  getSelectedStates() {
    let selectedStates;
    if (this.openStateCheckbox.isChecked) {
      selectedStates = "open";
    }
    if (this.closedStateCheckbox.isChecked) {
      selectedStates = "closed";
    }
    if (this.openStateCheckbox.isChecked === this.closedStateCheckbox.isChecked) {
      selectedStates = "both";
    }
    return selectedStates;
  }

  /**
   * Actualiza la visualizacion de los inputs de cupos disponibles para cuando se necesita 1 o 2
   * @param event Valor del dropdown de cupos disponibles
   */
  onChangeFromClassSize(event) {
    var inputsize1 = document.getElementById('class-size-input-1');
    var inputsize2 = document.getElementById('class-size-input-2');
    if (event === this.defaultTeachingMode) {
      inputsize1.style.display = 'none';
      inputsize2.style.display = 'none';
    }
    else if (event.key != 4) {
      inputsize1.style.display = 'none';
      inputsize2.style.display = 'inline-block';
    } else if (event.key == 4) {
      inputsize1.style.display = 'inline-block';
      inputsize2.style.display = 'inline-block';
      this.sizeValue2 = this.sizeValue1 + 1;
    }
  }

  /**
   * Valida el valor del primer input para el filtro de cupos, y cambia dinamicamente el segundo de ser necesario
   * @param event Texto que se esta ingresando en el primer input del filtro de cupos
   */
  onChangeInputSizeOne(event) {
    if (event != '') {
      if (this.sizeValue1 >= this.sizeValue2) {
        this.sizeValue2 = +this.sizeValue1 + 1;
      }
    }
  }

  /**
   * Valida el valor del segundo input para el filtro de cupos, y cambia dinamicamente el primero de ser necesario
   * @param event Texto que se esta ingresando en el segundo input del filtro de cupos
   */
  onChangeInputSizeTwo(event) {
    if (event != '') {
      if (this.sizeValue2 <= this.sizeValue1 && event > 0) {
        this.sizeValue1 = (this.sizeValue2) - 1;
      }
      if (event <= 0)
        this.sizeValue2 = 1;
    }
  }

  /**
   * Obtiene los datos del filtro de cupos
   */
  getClassSizeOption() {
    let creditFilterValues = {
      'firstOp': '',
      'comp': '',
      'secondOp': ''
    };
    if (this.sizeComparator === this.defaultTeachingMode) {
      creditFilterValues['firstOp'] = 'none';
      creditFilterValues['comp'] = '0';
      creditFilterValues['secondOp'] = 'none';
    } else {
      if (this.sizeComparator.key == 1) {
        creditFilterValues['firstOp'] = 'none';
        creditFilterValues['secondOp'] = this.sizeValue2;
      } else if (this.sizeComparator.key == 2) {
        creditFilterValues['firstOp'] = 'none';
        creditFilterValues['secondOp'] = this.sizeValue2;
      } else if (this.sizeComparator.key == 3) {
        creditFilterValues['firstOp'] = 'none';
        creditFilterValues['secondOp'] = this.sizeValue2;
      } else if (this.sizeComparator.key == 4) {
        creditFilterValues['firstOp'] = this.sizeValue1;
        creditFilterValues['secondOp'] = this.sizeValue2;
      }
      creditFilterValues['comp'] = this.sizeComparator.key;
    }

    return creditFilterValues;
  }

  /**
   * Crea el objeto filtro que se le enviara al servicio read-json-files
   */
  searchClasses() {
    let gradeToSend = this.gradeFilter;
    let modeToSend = this.selectedTeachingMode;
    let idToSend = this.searchedFilterId;
    let numberToSend = this.searchedFilterNumber;
    let codeToSend = this.searchedFilterCode;
    let yearToSend = this.year;
    if (this.searchedFilterId.replace(/\s/g, "") == "") {
      idToSend = 'none';
    }
    if (this.selectedTeachingMode === 'Cualquiera') {
      modeToSend = "none";
    }
    if (this.year === 'Cualquiera') {
      yearToSend = "none";
    }
    if (this.gradeFilter === 'Cualquiera') {
      gradeToSend = "none";
    }
    if (this.searchedFilterNumber == null || this.searchedFilterNumber.length == 0) {
      numberToSend = 'none';
    }
    if (this.searchedFilterCode == null || this.searchedFilterCode.length == 0) {
      codeToSend = 'none';
    }
    let data = {
      "type": "adv-filter",
      "teachingMode": modeToSend,
      "state": this.getSelectedStates(),
      "class-ID": idToSend,
      "class-number": numberToSend,
      'class-size': this.getClassSizeOption(),
      'class-code': codeToSend,
      'scholar-year': yearToSend,
      'grade': gradeToSend
    }
    this.data.changeMessage(data);
  }
}
