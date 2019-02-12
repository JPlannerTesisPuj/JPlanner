import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-block-modal',
  templateUrl: './block-modal.component.html',
})
export class BlockModalComponent implements OnInit {

  private blockName: string;
  private message;
  private blockSelectedItemsWeek: string;

  private blockSelectedOptionFrom = "";
  private blockSelectedOptionTo = "";

  private dropdownSettings = {};
  private dropdownListWeek= [];
  private blockHoursFrom= [];
  private blockHoursTo= [];

  constructor() { }

  ngOnInit() {

    this.dropdownListWeek = [
      'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'
    ];

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
    this.initHoursFrom();
  }

  /**
     * Inicia el dropdown de horas desde
     */
    initHoursFrom() {
      for (let i = 7; i <= 21; ++i) {
        this.blockHoursFrom.push(i + ':00');
      }
    }

  @Output() messageEvent = new EventEmitter<string>();

  /**
   * Si horas desde se muestra, entonces se muestra el horas hasta
   */
  onChangeFromBlockHour(item: any) {
    var hour = document.getElementById('blockHourTo');
    hour.style.display = 'inline-block'
    this.changeHoursTo(item);
  }

  /**
   * @param item El item que se selecciono en el dropdown de horas desde
   * Llena dinamicamente el arreglo de horas hasta para que siempre comienze desde la siguiente hora a la seleccionada
   * en horas desde
   */
  changeHoursTo(item) {
    this.blockHoursTo = [];
    var numberItem = item.substring(0, item.indexOf(':'));
    numberItem++;
    for (let i = numberItem; i <= 22; ++i) {
      this.blockHoursTo.push(i + ':00');
    }
  }

  //Envias los datos del modal al calendar
  addBlock(){

    //Convierte el arreglo de dias a un string separado con -
    let daysBlock = this.blockSelectedItemsWeek.toString().replace(/,/g, '-');

    //Separar el formato de horario y pasarlo a segundos
    var selectedFromSecondsArray = this.blockSelectedOptionFrom.split(':');
    var selectedToSecondsArray = this.blockSelectedOptionTo.split(':');

    var selectedFromSeconds = (+selectedFromSecondsArray[0]) * 60 * 60 + (+selectedFromSecondsArray[1]) * 60;
    var selectedToSeconds = (+selectedToSecondsArray[0]) * 60 * 60 + (+selectedToSecondsArray[1]) * 60;

    //Unir todo el mensaje para enviarlo
    let data = this.blockName + "," + daysBlock + "," + selectedFromSeconds + "," + selectedToSeconds;

    this.message = 'Master';
    this.messageEvent.emit(data);
  }

}
