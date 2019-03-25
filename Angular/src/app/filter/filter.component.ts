import { Component, OnInit } from '@angular/core';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
})

export class FilterComponent implements OnInit {

  // Variables filtos básicos
  private dropdownListWeek: string[] = [];
  private dropdownListSearch: string[] = [];
  private selectedItemsWeek: string[] = [];
  private selectedItemsSearch: string[] = [];
  private dropdownSettings: any = {};
  private hoursFrom: string[]  = [];
  private hoursTo: string[]  = [];
  private selectedOptionFrom = '';
  private selectedOptionTo = '';
  private creditsComparatorOptions: any = {};
  private creditsComparator: any;
  private searchBox: string;
  private creditValue1: any[];
  private selectedCreditValue1: number;
  private creditValue2: any[];
  private selectedCreditValue2: number = 1;
  private shouldDisplayCreditValue1: boolean = false;
  private shouldDisplayCreditValue2: boolean = false;
  private dayComparator: string = '0';
  private errorFilterSearch: boolean;
  private errorFilterSearchN: boolean;

  // Variables filtro avanzado
  private teachingModeDropdown: any;
  private selectedTeachingMode: string;
  private defaultTeachingMode: string;
  private openStateCheckbox: any;
  private closedStateCheckbox: any;
  private searchedFilterId: string;
  private searchedFilterNumber: string;
  private searchedFilterCode: string;
  private year: string;
  private dropdownSchoolYear: string[] = [];
  private gradeFilter: string;
  private dropdownGrades: any;
  private sizeComparatorOptions: any;
  private sizeComparator: any;
  private sizeValue1: any [] = [];
  private sizeValue2: any []= [];
  private selectedSizeValue1: number = 2;
  private selectedSizeValue2: number = 1;
  private shouldDisplaySizeValue1: boolean = false;
  private shouldDisplaySizeValue2: boolean = false;

  private yearActualCycle;

  // Mensaje con los datos de los filtros
  private filterMsj: any;
  // Control si la búsqueda es o no avanzada
  private isAdvancedSearch: boolean;

  constructor(private readJSONFileService: ReadJsonFileService, private data: DataService) { }

  ngOnInit() {
    this.isAdvancedSearch = false;
    this.creditsComparator = '';
    this.creditValue1 = [];
    this.creditValue2 = [];
    this.defaultTeachingMode = 'Cualquiera';
    this.selectedTeachingMode = this.defaultTeachingMode;
    this.sizeComparator = this.defaultTeachingMode;
    this.year = this.defaultTeachingMode;
    this.gradeFilter = this.defaultTeachingMode;
    this.searchedFilterId = '';
    this.searchedFilterNumber = '';
    this.searchedFilterCode = '';
    this.dropdownSchoolYear = [];
    this.dropdownListSearch = [
      'Nombre de Asignatura',
      'Profesor',
      'Departamento'
    ];
    this.dropdownListWeek = [
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sabado',
      'Domingo'
    ];
    this.creditsComparatorOptions = {
      0: 'Cualquiera',
      1: 'Mayor a',
      2: 'Menor a',
      3: 'Igual a',
      4: 'Entre'
    };
    this.sizeComparatorOptions = {
      1: 'Mayor a',
      2: 'Menor a',
      3: 'Igual a',
      4: 'Entre'
    };
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
    // Opciones de configruación del dropdwn
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      unSelectAllText: 'Remover Todos',
      selectAllText: 'Seleccionar Todos',
      singleSelection: false,
      enableCheckAll: true,
      allowSearchFilter: false,
      itemsShowLimit: 7
    };
    this.openStateCheckbox = {
      id: 'open-state-checkbox',
      name: 'Abierta',
      isChecked: false,
    };
    this.closedStateCheckbox = {
      id: 'closed-state-checkbox',
      name: 'Cerrada',
      isChecked: false,
    };

    // Subscripción para recbir mensajes
    this.initDropDowns();
    this.data.currentMessage.subscribe(message => this.filterMsj = message);
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

  }



  /**
   * Llena dinámicamente el arreglo del dropdown con los ciclos lectivos.
  */
  private schoolYear() {
    let currentdate = new Date();
    let fullYear = currentdate.getFullYear();
    let actualCycle: number;

    if (currentdate.getMonth() < 6) {
      actualCycle = 1;
    } else if (currentdate.getMonth() == 6) {
      if (currentdate.getDate() > 16) {
        actualCycle = 2;
      } else {
        actualCycle = 1;
      }
    } else if (currentdate.getMonth() == 7) {
      if (currentdate.getDate() < 14) {
        actualCycle = 2;
      } else {
        actualCycle = 3;
      }
    } else if (currentdate.getMonth() >= 8) {
      actualCycle = 3;
    }

    this.yearActualCycle = fullYear + '-' + actualCycle
    this.dropdownSchoolYear.push(this.yearActualCycle);
    let yearMajor1Cycle = this.yearMajor(fullYear, actualCycle);
    this.dropdownSchoolYear.push(yearMajor1Cycle);
    let yearMajor2Cycle = this.yearMajor(+yearMajor1Cycle.split('-')[0], +yearMajor1Cycle.split('-')[1]);
    this.dropdownSchoolYear.push(yearMajor2Cycle);
    let yearMinor1Cycle = this.yearMinor(fullYear, actualCycle);
    this.dropdownSchoolYear.push(yearMinor1Cycle);
    let yearMinor2Cycle = this.yearMinor(+yearMinor1Cycle.split('-')[0], +yearMinor1Cycle.split('-')[1]);
    this.dropdownSchoolYear.push(yearMinor2Cycle);

    this.dropdownSchoolYear.sort();
  }

  /**
   * @param year Año
   * @param cycle Ciclo lectivo
   * 
   * @returns String que une año y ciclo lectivo en un solo string
   */
  private yearMajor(year: number, cycle: number) {
    let newCycle = cycle + 1;
    let auxYear = year;

    if (newCycle == 3) {
      return auxYear + '-' + newCycle;
    } else if (newCycle == 2) {
      return auxYear + '-' + newCycle;
    } else if (newCycle == 4) {
      newCycle = 1;
      auxYear = auxYear + 1;
      return auxYear + '-' + newCycle;
    }
  }

  /**
   * @param year Año escogido
   * @param cycle Ciclo lectivo escogido
   * 
   * @returns String que une año y ciclo lectivo en un solo string
   */
  private yearMinor(year: number, cycle: number): string {
    let newCycle = cycle - 1;
    let auxYear = year;

    if (newCycle == 0) {
      newCycle = 3;
      auxYear = auxYear - 1;
      return auxYear + '-' + newCycle;
    } else if (newCycle == 2) {
      return auxYear + '-' + newCycle;
    } else if (newCycle == 1) {
      return auxYear + '-' + newCycle;
    }

  }

  /**
   * @returns parametro del estado seleccionado para el filtro
   */
  private getSelectedStates(): string {
    let selectedStates = '';

    if (this.openStateCheckbox.isChecked) {
      selectedStates = 'open';
    }
    if (this.closedStateCheckbox.isChecked) {
      selectedStates = 'closed';
    }
    if (this.openStateCheckbox.isChecked == this.closedStateCheckbox.isChecked) {
      selectedStates = 'both';
    }
    if (!this.openStateCheckbox.isChecked && !this.closedStateCheckbox.isChecked){
      selectedStates = 'open';
    }
    return selectedStates;
  }

  /**
   * Actualiza la visualizacion de los inputs de cupos disponibles para cuando se necesita 1 o 2
   * @param value Valor del dropdown de cupos disponibles
   */
  private onChangeFromClassSize(value: any) {
    this.sizeValue2[0].disabled = false;
    this.sizeValue1[this.sizeValue1.length-1].disabled = false;
    if (value === this.defaultTeachingMode) {
      this.shouldDisplaySizeValue1 = false;
      this.shouldDisplaySizeValue2 = false;
    } else if (value.key != 4) {
      this.shouldDisplaySizeValue1 = false;
      this.shouldDisplaySizeValue2 = true;
      if(value.key==2){
        this.selectedSizeValue2=2;
        this.sizeValue2[0].disabled = true;
      }
    } else if (value.key == 4) {
      this.shouldDisplaySizeValue1 = true;
      this.shouldDisplaySizeValue2 = true;
      this.selectedSizeValue1 = 1;
      this.selectedSizeValue2 = 2;
      this.sizeValue1[this.sizeValue1.length-1].disabled = true;
    }
  }


  /**
   * Valida el valor del segundo input para el filtro de cupos, y cambia dinámicamente el primero de ser necesario
   * @param value numero que se esta ingresando en el primer input del filtro de cupos
   */
  private onChangeSizeOne(value: number) {
    this.sizeValue2 = [];
    for(let i = Number(value)+1; i <=100; i ++){
      this.sizeValue2.push({
        "value":i,
        "disabled":false,
      })
    } 
  }

  /**
   * Obtiene los datos del filtro de cupos
   * 
   * @returns creditFilterValues: datos del filtro de cupos
   */
  private getClassSizeOption(): any {
    let creditFilterValues: any = {
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
        creditFilterValues['secondOp'] = this.selectedSizeValue2;
      } else if (this.sizeComparator.key == 2) {
        creditFilterValues['firstOp'] = 'none';
        creditFilterValues['secondOp'] = this.selectedSizeValue2;
      } else if (this.sizeComparator.key == 3) {
        creditFilterValues['firstOp'] = 'none';
        creditFilterValues['secondOp'] = this.selectedSizeValue2;
      } else if (this.sizeComparator.key == 4) {
        creditFilterValues['firstOp'] = this.selectedSizeValue1;
        creditFilterValues['secondOp'] = this.selectedSizeValue2;
      }
      creditFilterValues['comp'] = this.sizeComparator.key;
    }

    return creditFilterValues;
  }

  /**
   * Crea el objeto filtro que se le enviara al servicio read-json-files
   */
  private searchClasses() {
    let gradeToSend = this.gradeFilter;
    let modeToSend = this.selectedTeachingMode;
    let idToSend = this.searchedFilterId;
    let numberToSend = this.searchedFilterNumber;
    let codeToSend = this.searchedFilterCode;
    let yearToSend = this.year;

    if (this.searchedFilterId.replace(/\s/g, '') == '') {
      idToSend = 'none';
    }
    if (this.selectedTeachingMode === 'Cualquiera') {
      modeToSend = 'none';
    }
    if (this.year === 'Cualquiera') {
      yearToSend = this.yearActualCycle;
      if(this.isAdvancedSearch){
        yearToSend = 'none';
      }
    }
    if (this.gradeFilter === 'Cualquiera') {
      gradeToSend = 'none';
    }
    if (this.searchedFilterNumber == null || this.searchedFilterNumber.length == 0) {
      numberToSend = 'none';
    }
    if (this.searchedFilterCode == null || this.searchedFilterCode.length == 0) {
      codeToSend = 'none';
    }

    // Convierte el arreglo de dias a un string separado con -
    let days = this.selectedItemsWeek.toString().replace(/,/g, '-');
    if (days == '') {
      days = 'none';
    }

    // Convierte la hora a long
    let hmsFrom = this.selectedOptionFrom + ':00';
    let splittedFrom = hmsFrom.split(':');
    let secondsFrom = (+splittedFrom[0]) * 60 * 60 + (+splittedFrom[1]) * 60 + (+splittedFrom[2]);

    // Convierte la hora a long
    let hmsTo = this.selectedOptionTo + ':00';
    let splittedTo = hmsTo.split(':');
    let secondsTo = (+splittedTo[0]) * 60 * 60 + (+splittedTo[1]) * 60 + (+splittedTo[2]);

    if (isNaN(secondsTo)) {
      secondsTo = 86399;
    }
    if (isNaN(secondsFrom)) {
      secondsFrom = 0;
    }

    let hours: any = {
      'from': secondsFrom,
      'to': secondsTo
    }

    let selectedDropdownSearch = this.selectedItemsSearch.toString().replace(/,/g, '-');
    if (selectedDropdownSearch === '') {
      selectedDropdownSearch = 'none';
    }
    let sendedSearchBox = this.searchBox;
    if (this.searchBox === '' || this.searchBox === undefined){
      sendedSearchBox = 'none';
    }
    let searchFields: any = {
      'searched': sendedSearchBox,
      'params': selectedDropdownSearch
    }

    let creditsToSend = this.getSelectedCredits();
    let stateToSend = this.getSelectedStates();
    let classSizeToSend = this.getClassSizeOption();

    let data = {
      'type': 'filter',
      'days': days,
      'dayComparator': this.dayComparator,
      'hours': hours,
      'searchBox': searchFields,
      'credits': creditsToSend,
      'teachingMode': modeToSend,
      'state': stateToSend,
      'class-ID': idToSend,
      'class-number': numberToSend,
      'class-size': classSizeToSend,
      'scholar-year': yearToSend,
      'grade': gradeToSend
    }

    // Si el filtro es básico , no envie los datos de esos filtros
    if (!this.isAdvancedSearch) {
      this.restartAdvFilter(data);
    }

    if(this.validateSearch(data, this.yearActualCycle))
      this.data.changeMessage(data);
  }

  private CleanAll() {
    this.sizeComparator = this.defaultTeachingMode;
    this.creditsComparator = this.defaultTeachingMode;
    this.shouldDisplayCreditValue1 = this.shouldDisplayCreditValue2 = this.shouldDisplaySizeValue1 = this.shouldDisplaySizeValue2 = false;
    this.selectedCreditValue1 = 1;
    this.selectedCreditValue2 = 1;
    this.selectedSizeValue1 = 1;
    this.selectedSizeValue2 = 1;
    this.selectedOptionFrom = '';
    this.selectedOptionTo = '';
    this.creditsComparator = '';
    
    this.selectedItemsWeek = [];
    this.searchBox = '';
    this.selectedItemsSearch = [];

    this.defaultTeachingMode = 'Cualquiera';
    this.openStateCheckbox = {
      id: 'open-state-checkbox',
      name: 'Abierta',
      isChecked: false,
    }

    this.closedStateCheckbox = {
      id: 'closed-state-checkbox',
      name: 'Cerrada',
      isChecked: false,
    }

    this.selectedTeachingMode = this.defaultTeachingMode;
    this.sizeComparator = this.defaultTeachingMode;
    this.year = this.defaultTeachingMode;
    this.gradeFilter = this.defaultTeachingMode;

    this.searchedFilterId = '';
    this.searchedFilterNumber = '';
    this.searchedFilterCode = '';
  }

  /**
   * @param data Es el objeto con todos los parametros del filtro
   * 
   * Reinicia todos los parámetros del filtro avanzado para que el servicio no busque en ellos
   */
  private restartAdvFilter(data) {
    data['teachingMode'] = 'none';
    data['state'] = 'open';
    data['class-ID'] = 'none';
    data['class-number'] = 'none';
    data['class-size']['comp'] = 0;
    data['class-size']['firstOp'] = 'none';
    data['class-size']['secondOp'] = 'none';
    data['class-code'] = 'none';
    data['scholar-year'] = this.yearActualCycle;
    data['grade'] = 'none';
  }

  /**
   * Recupera los datos del filtro de creditos
   * 
   * @returns Objeto con el código del operador y los valores a comparar
   */
  private getSelectedCredits(): any {
    let operator: number;
    let creditValue1: number;
    let creditValue2: number;
    operator = this.creditsComparator.key;
    if (this.creditsComparator.key === undefined) {
      operator = 0;
      creditValue1 = -1;
      creditValue2 = -1;
    } else if (this.creditsComparator.key == 4) {
      creditValue1 = Number(this.selectedCreditValue1); 
      creditValue2 = Number(this.selectedCreditValue2);
    } else {
      creditValue1 = null;
      creditValue2 = Number(this.selectedCreditValue2);
    }

    return {
      'creditComparator': operator,
      'creditValue1': creditValue1,
      'creditValue2': creditValue2
    }
  }

  /**
   * Inicia el dropdown de horas desde y de creditos1
   */
  private initDropDowns() {
    this.hoursFrom.push('Ninguno');
    for (let i = 7; i <= 21; ++i) {
      this.hoursFrom.push(i + ':00');
    }
    for(let i = 1;i<=20;i++){
      this.creditValue2.push({
        "value":i,
        "disabled":false,
      });
      this.creditValue1.push({
        "value":i,
        "disabled":false,
      });
    }
    for(let i= 1; i<=100;i++){
      this.sizeValue2.push({
        "value":i,
        "disabled":false,
      });
      this.sizeValue1.push({
        "value":i,
        "disabled":false,
      });
    }
  }

  /**
   * Si horas desde se muestra, entonces se muestra el horas hasta
   */
  private onChangeFromHour(item: any) {
    let hour = document.getElementById('fil-hourTo');

    if (item == 'Ninguno') {
      hour.style.display = 'none';
    } else {
      hour.style.display = 'inline-block';
    }

    this.changeHoursTo(item);
  }

  /**
   * Muestra o esconde los campos de créditos según la información que le llega
   * 
   * @param item índice de la opción seleccionada
   */
  private onChangeFromCredit(item: any) {
    this.creditValue2[0].disabled = false;
    this.creditValue1[this.creditValue1.length-1].disabled = false;
    if (item.key == 0) {
      this.shouldDisplayCreditValue1 = false;
      this.shouldDisplayCreditValue2 = false;
    } else {
      if (item.key != 4) {
        this.shouldDisplayCreditValue1 = false;
        this.shouldDisplayCreditValue2 = true;
        if(item.key ==2){
          this.selectedCreditValue2=2;
          this.creditValue2[0].disabled = true;
        }
      } else if (item.key == 4) {
        this.shouldDisplayCreditValue1 = true;
        this.shouldDisplayCreditValue2 = true;
        this.selectedCreditValue1 = 1;
        this.selectedCreditValue2 = 2;
        this.creditValue1[this.creditValue1.length-1].disabled = true;
      }
    }
  }


  /**
   * @param item El item que se selecciono en el dropdown de horas desde
   * Llena dinámicamente el arreglo de horas hasta para que siempre comienze desde la siguiente hora a la seleccionada
   * en horas desde
   */
  private changeHoursTo(item) {
    this.hoursTo = [];
    let numberItem = item.substring(0, item.indexOf(':'));

    numberItem++;

    for (let i = numberItem; i <= 22; ++i) {
      this.hoursTo.push(i + ':00');
    }
  }

  /**
   * Cambia el valor del número de créditos de menor valor cuando se cambia el valor del mayor número de créditos
   * 
   * @param value valor de créditos que se recibe
   */
  private onChangeCreditValue1(value: number) {
   this.creditValue2 = [];
   let from = Number(value)+1;
   for(let i = from; i <= 20 ; ++i){
     this.creditValue2.push({
       "value":i,
       "disabled":false,
     })
   }
  }
  

  /**
   * @param event El botón de busqueda oprimido (Básica o Avanzada)
   * 
   * Muestra o esconde los campos de la búsqueda avanada y setea el atributo isAdvanceSearch
   */
  private clickedTab(event) {
    let advFilters = document.getElementById('fil-adv-filters');
    if (event.currentTarget.id == 'basic-search') {
      //Display None to Adv Search
      advFilters.classList.add('hidden');
      this.isAdvancedSearch = false;

      document.getElementById('basic-search').style.border = 'solid 1px #000000';
      document.getElementById('basic-search').style.color = '#000000';

      document.getElementById('adv-search').style.border = 'solid 1px #b1b1b1';
      document.getElementById('adv-search').style.color = '#cbcbcb';

    } else if (event.currentTarget.id == 'adv-search') {
      //Display Adv Search
      advFilters.classList.remove('hidden');
      this.isAdvancedSearch = true;

      document.getElementById('basic-search').style.border = 'solid 1px #b1b1b1';
      document.getElementById('basic-search').style.color = '#cbcbcb';

      document.getElementById('adv-search').style.border = 'solid 1px #000000';
      document.getElementById('adv-search').style.color = '#000000';

    }
  }

  /**
   * 
   * Este método valida si los campos de búsqueda estan vacíos
   */
  private validateSearch(data: any, yearActualCycle: any): boolean{
    
    if (data['days'] == "none" && data['hours'].from == 0 && data['hours'].to == 86399 
          && data['searchBox'].searched == "none" && data['searchBox'].params == "none" 
          && data['credits'].creditComparator == 0 && data['credits'].creditValue1 == -1
          && data['credits'].creditValue2 == -1 && data['teachingMode'] == "none" && data['state'] == "open"
          && data['class-ID'] == "none" && data['class-number'] == "none" && data['class-size'].firstOp == "none"
          && data['class-size'].comp == 0 && data['class-size'].secondOp == "none" 
          && data['scholar-year'] == yearActualCycle && data['grade'] == "none"){
      return false;
    }
    
    return true;
  }

  /**
   * 
   * Este método valida el campo de búsqueda y muestra una alerta
   */
  private checkInputFieldSearch(input: string){
    if(input.length < 2 && input.length != 0){
      this.errorFilterSearchN = true;
    } else {
      this.errorFilterSearchN = false;
    }
  }

  private onlyLetters(){
    //Este método hace que el input solo admita letras
    document.getElementById('fil-searchBox').onkeydown = function (e) {
      if (!e.key.match(/^[A-Za-z]*$/)) {
        e.preventDefault();  
      }
    };
  }

}
