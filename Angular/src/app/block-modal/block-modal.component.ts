import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-block-modal',
  templateUrl: './block-modal.component.html',
})
export class BlockModalComponent {

  private blockName: string;
  private blockSelectedItemsWeek: string;

  private blockSelectedOptionFrom = '';
  private blockSelectedOptionTo = '';

  private dropdownSettings = {};
  private dropdownListWeek = [];
  private blockHoursFrom = [];
  private blockHoursTo = [];
  private errorMessage: string = '';
  private errorExists: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<BlockModalComponent>
  ) {
    this.dropdownListWeek = [
      { item_id: 0, item_text: 'Lunes' },
      { item_id: 1, item_text: 'Martes' },
      { item_id: 2, item_text: 'Miércoles' },
      { item_id: 3, item_text: 'Jueves' },
      { item_id: 4, item_text: 'Viernes' },
      { item_id: 5, item_text: 'Sábado' },
      { item_id: 6, item_text: 'Domingo' }
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

  /**
   * Si horas desde se muestra, entonces se muestra el horas hasta
   */
  private onChangeFromBlockHour(item: any) {
    var hour = document.getElementById('blockHourTo');
    hour.style.display = 'inline-block'
    this.changeHoursTo(item);
  }

  /**
   * @param item El item que se selecciono en el dropdown de horas desde
   * Llena dinamicamente el arreglo de horas hasta para que siempre comienze desde la siguiente hora a la seleccionada
   * en horas desde
   */
  private changeHoursTo(item) {
    this.blockHoursTo = [];
    var numberItem = item.substring(0, item.indexOf(':'));
    numberItem++;
    for (let i = numberItem; i <= 22; ++i) {
      this.blockHoursTo.push(i + ':00');
    }
  }

  /**
   * Envia los datos del modal al Calendar
   */
  private createBlocks() {

    if (this.blockSelectedItemsWeek == undefined) {
      this.errorMessage = 'Seleccione los días de la semana en los que quiere crear el bloqueo';
      this.errorExists = true;

      return;
    }

    if (this.blockSelectedOptionFrom == undefined || this.blockSelectedOptionFrom == '') {
      this.errorMessage = 'Seleccione la hora inicial en la que quiere crear el bloqueo';
      this.errorExists = true;

      return;
    }

    if (this.blockSelectedOptionTo == undefined || this.blockSelectedOptionTo == '') {
      this.errorMessage = 'Seleccione la hora final en la que quiere crear el bloqueo';
      this.errorExists = true;

      return;
    }

    //Convierte el arreglo de dias a un string separado con -
    let daysBlock = this.blockSelectedItemsWeek;

    //Separar el formato de horario y pasarlo a segundos
    var selectedFromArray = this.blockSelectedOptionFrom.split(':');
    var selectedToArray = this.blockSelectedOptionTo.split(':');

    var selectedFrom = selectedFromArray[0];
    var selectedTo = selectedToArray[0];

    //Unir todo el mensaje para enviarlo
    let data = {
      ['blockName']: this.blockName,
      ['daysBlock']: daysBlock,
      ['hourFrom']: selectedFrom,
      ['hourTo']: selectedTo
    }
    console.log(data)

    this.dialogRef.close(data);
  }
}