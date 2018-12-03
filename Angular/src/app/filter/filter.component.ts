import { Component, OnInit } from '@angular/core';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
 })
 
export class FilterComponent implements OnInit {
  private dropdownListWeek = [];
  private selectedItemsWeek = [];
  private dropdownSettings = {};
  private hoursFrom = [];
  private hoursTo = [];
  private selectedOptionFrom ="";
  private selectedOptionTo ="";
  private filterMsj;
  
  constructor(private readJSONFileService: ReadJsonFileService,private data: DataService) { }

  ngOnInit() {
    //Subscripcion para recbir mensajes
    this.data.currentMessage.subscribe(message => this.filterMsj = message);

    this.dropdownListWeek = [
      'Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'
    ];

    //Opciones de configruacion del dropdwn
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll:true,
      itemsShowLimit: 7,
      allowSearchFilter: false,
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Remover Todos'
    };
    this.initHoursFrom();
  }
 
  filter(){
    if(this.validate())
    {
      //Convierte el arreglo de dias a un string separado con -
      var days = this.selectedItemsWeek.toString().replace(/,/g,'-');
   
      // Convierte la hora a long
      var hmsFrom = this.selectedOptionFrom+":00";
      var splittedFrom= hmsFrom.split(':');
      var secondsFrom = (+splittedFrom[0]) * 60 * 60 + (+splittedFrom[1]) * 60 + (+splittedFrom[2]); 
   
      //Convierte la hora a long
      var hmsTo = this.selectedOptionTo+":00";
      var splittedTo= hmsTo.split(':');
      var secondsTo = (+splittedTo[0]) * 60 * 60 + (+splittedTo[1]) * 60 + (+splittedTo[2]); 
      //Mensaje que sera enviado
      var data = {
        "type": "filterHourDay",
        "days": days,
        "hourFrom":secondsFrom,
        "hourTo": secondsTo
      }
      this.data.changeMessage(data);
    }
  }

  filterViewAll(){
    //Mensaje que sera enviado
    var data = {
      "type": "view all",
    }
    this.data.changeMessage(data);
  }

  validate(){
      if(this.selectedOptionFrom =='' && this.selectedItemsWeek.length==0){
      alert('Porfavor eliga una opcion de filtro');
      return false;
      }
      else if(this.selectedOptionTo=='' && this.selectedOptionFrom !='' ){
      alert('Porfavor eliga una franja horaria');
      return false;
      }
      
    return true;
  }
  initHoursFrom(){
    for(let i=7;i<=21;++i){
        this.hoursFrom.push(i+':00');
    }
  }

    onChangeFrom(item: any){
    var hour =document.getElementById('hourTo');
    hour.style.display = 'inline-block'
    this.changeHoursTo(item);
  }

  changeHoursTo(item){
    this.hoursTo = [];
    var numberItem = item.substring(0,item.indexOf(':'));
    numberItem ++;
    for(let i=numberItem;i<=22;++i){
      this.hoursTo.push(i+':00');
    }
  }
}
