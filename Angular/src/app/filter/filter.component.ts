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
  private creditValue: number;
  private creditValue2: number;

  // Variables filtro avanzado
  private teachingModeDropdown: any;
  private selectedTeachingMode: string;
  private defaultTeachingMode: string;;
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
  private sizeValue1: number;
  private sizeValue2: number;
  private yearActualCycle;

  // Mensaje con los datos de los filtros
  private filterMsj: any;
  // Control si la búsqueda es o no avanzada
  private isAdvancedSearch: boolean;

  constructor(private readJSONFileService: ReadJsonFileService, private data: DataService) { }

  ngOnInit() {
    this.isAdvancedSearch = false;
    this.creditsComparator = '';
    this.creditValue = 1;
    this.creditValue2 = 2;
    this.defaultTeachingMode = 'Cualquiera';
    this.selectedTeachingMode = this.defaultTeachingMode;
    this.sizeComparator = this.defaultTeachingMode;
    this.year = this.defaultTeachingMode;
    this.gradeFilter = this.defaultTeachingMode;
    this.searchedFilterId = '';
    this.searchedFilterNumber = '';
    this.searchedFilterCode = '';
    this.sizeValue1 = 1;
    this.sizeValue2 = 1;
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
    this.initHoursFrom();
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
    if (!this.openStateCheckbox.isChecked == !this.closedStateCheckbox.isChecked){
      selectedStates = 'open';
    }
    return selectedStates;
  }

  /**
   * Actualiza la visualizacion de los inputs de cupos disponibles para cuando se necesita 1 o 2
   * @param event Valor del dropdown de cupos disponibles
   */
  private onChangeFromClassSize(event: any) {
    let inputsize1 = document.getElementById('fil-class-size-input-1');
    let inputsize2 = document.getElementById('fil-class-size-input-2');

    if (event === this.defaultTeachingMode) {
      inputsize1.style.display = 'none';
      inputsize2.style.display = 'none';
    } else if (event.key != 4) {
      inputsize1.style.display = 'none';
      inputsize2.style.display = 'inline-block';
    } else if (event.key == 4) {
      inputsize1.style.display = 'inline-block';
      inputsize2.style.display = 'inline-block';
      this.sizeValue2 = this.sizeValue1 + 1;
    }
  }

  /**
   * Valida el valor del primer input para el filtro de cupos, y cambia dinámicamente el segundo de ser necesario
   * @param event Texto que se esta ingresando en el primer input del filtro de cupos
   */
  private onChangeInputSizeOne(event: any) {
    if (event != '') {
      if (this.sizeValue1 >= this.sizeValue2) {
        this.sizeValue2 = +this.sizeValue1 + 1;
      }
    }
  }

  /**
   * Valida el valor del segundo input para el filtro de cupos, y cambia dinámicamente el primero de ser necesario
   * @param event Texto que se esta ingresando en el segundo input del filtro de cupos
   */
  private onChangeInputSizeTwo(event: any) {
    if (event != '') {
      if (this.sizeValue2 <= this.sizeValue1 && event > 0) {
        this.sizeValue1 = (this.sizeValue2) - 1;
      }
      if (event <= 0) {
        this.sizeValue2 = 1;
      }
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
        creditFilterValues['secondOp'] = this.sizeValue2 + '';
      } else if (this.sizeComparator.key == 2) {
        creditFilterValues['firstOp'] = 'none';
        creditFilterValues['secondOp'] = this.sizeValue2 + '';
      } else if (this.sizeComparator.key == 3) {
        creditFilterValues['firstOp'] = 'none';
        creditFilterValues['secondOp'] = this.sizeValue2 + '';
      } else if (this.sizeComparator.key == 4) {
        creditFilterValues['firstOp'] = this.sizeValue1 + '';
        creditFilterValues['secondOp'] = this.sizeValue2 + '';
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
      'hours': hours,
      'searchBox': searchFields,
      'credits': creditsToSend,
      'teachingMode': modeToSend,
      'state': stateToSend,
      'class-ID': idToSend,
      'class-number': numberToSend,
      'class-size': classSizeToSend,
      'class-code': codeToSend,
      'scholar-year': yearToSend,
      'grade': gradeToSend
    }

    // Si el filtro es básico , no envie los datos de esos filtros
    if (!this.isAdvancedSearch) {
      this.restartAdvFilter(data);
    }
    this.data.changeMessage(data);
  }

  private CleanAll() {
    this.selectedOptionFrom = '';
    this.selectedOptionTo = '';
    this.creditsComparator = '';
    this.onCleanCredit();

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
      creditValue1 = Number(this.creditValue);
      creditValue2 = Number(this.creditValue2);
    } else {
      creditValue1 = null;
      creditValue2 = Number(this.creditValue2);
    }

    return {
      'creditComparator': operator,
      'creditValue1': creditValue1,
      'creditValue2': creditValue2
    }
  }

  /**
   * Inicia el dropdown de horas desde
   */
  private initHoursFrom() {
    this.hoursFrom.push('Ninguno');
    for (let i = 7; i <= 21; ++i) {
      this.hoursFrom.push(i + ':00');
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
    let credit1 = document.getElementById('fil-credit-input-1');
    let credit2 = document.getElementById('fil-credit-input-2');

    if (item.key == 0) {
      credit1.style.display = 'none';
      credit2.style.display = 'none';
    } else {
      if (item.key != 4) {
        credit1.style.display = 'none';
        credit2.style.display = 'inline-block';
        this.creditValue2 = 2;
      } else if (item.key == 4) {
        credit1.style.display = 'inline-block';
        credit2.style.display = 'inline-block';
        this.creditValue = 1;
        this.creditValue2 = 2;
      }
    }
  }

  /**
   * Esconde los campos de los créditos
   */
  private onCleanCredit() {
    let credit1 = document.getElementById('fil-credit-input-1');
    let credit2 = document.getElementById('fil-credit-input-2');
    let sizeInput1 = document.getElementById('fil-class-size-input-1');
    let sizeInput2 = document.getElementById('fil-class-size-input-2');

    credit1.style.display = 'none';
    credit2.style.display = 'none';
    sizeInput1.style.display = 'none';
    sizeInput2.style.display = 'none';
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
   * @param item valor de créditos que se recibe
   */
  private onChangeInputCreditOne(item: any) {
    if (item != '') {
      if (item >= 19) {
        this.creditValue = 19;
      }
      if (this.creditValue + 1 > 19) {
        if (this.creditValue >= this.creditValue2) {
          this.creditValue2 = +this.creditValue + 1;
        }
      }
    }
  }

  /**
   * Cambia el valor del número de créditos de mayor valor cuando se cambia el valor del menor número de créditos
   * 
   * @param item valor de créditos que se recibe
   */
  private onChangeInputCreditTwo(item: any) {
    if (item != '') {
      if (item <= 0) {
        this.creditValue2 = 2;
      }
      if (item >= 21) {
        this.creditValue2 = 20;
      }
      if (this.creditValue - 1 > 0) {
        if (this.creditValue2 <= this.creditValue) {
          this.creditValue = (this.creditValue2) - 1;
        }
      }
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

    } else if (event.currentTarget.id == 'adv-search') {
      //Display Adv Search
      advFilters.classList.remove('hidden');
      this.isAdvancedSearch = true;
    }
  }
}
