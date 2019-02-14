import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, Input } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDay, areRangesOverlapping } from 'date-fns';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from '../shared/model/Subject';
import { Subject as SubjectRXJS, generate } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatHeaderRow } from '@angular/material';
import { ClassModalComponent } from '../class-modal/class-modal.component';
import { DataService } from '../shared/data.service';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { BlockModalComponent } from '../block-modal/block-modal.component';
import { Horary } from '../shared/model/Horary';

/**
 * The documentation used to develop this calendar was taken form https://www.npmjs.com/package/angular-calendar
 * and also https://mattlewis92.github.io/angular-calendar/#/kitchen-sink
 */

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  black: {
    primary: '#000000',
    secondary: '#dddddd'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html'
})

export class CalendarComponent implements OnInit {

  private view: CalendarView = CalendarView.Week;
  private calendarView = CalendarView; // Enum
  private viewDate: Date = new Date();
  private calendarClasses: Subject[] = [];
  private calendarBlocks: Subject[] = [];
  private verticalMenuIndex: number = 0;
  private listBlockID: Number[]= [];

  message:string;


  /**
   * Esta variable contiene las clases que se mostrarán en el horario. Los atributos cada clase que se muestra son:
   * start: fecha de inicio de la materia, incluye la hora en que inicia la clase y el día de la semana en que se tomará.
   * end: fecha de fin de la materia, incluye la hora en que finaliza la clase y el día de la semana en que se tomará.
   * color: es el color con el que se pintará la materia en el horario.
   * title: es el título de la clase que aparecerá en el bloque del horario de la materia
   */
  private classes: CalendarEvent[] = [];
  private refresh: SubjectRXJS<any> = new SubjectRXJS();


  //Se añade un evento personalizado a cada uno de las materias del calendario
  private actions: CalendarEventAction[] = [
    {
      label: '<i class="material-icons remove-icon"> clear </i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Removed', event);
      }
    },
  ];

  constructor(public dialog: MatDialog, private data: DataService, private readJSONFileService: ReadJsonFileService) { }

  ngOnInit() {

    /**
     * Se suscribe al envío de mensajes de si ha habido una búsqueda o no, en caso de que
     * haya una búsqueda cambia el index del menú de íconos para que este cambie de pestaña.
     */
    let filter;
    this.data.currentMessage.subscribe(message => {
      filter = message;
      if (filter['type'] == 'filter') {
        this.verticalMenuIndex = 1;
      }
    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  /**
   * Toma el número de un día en la semana y obtiene la fecha de ese día en la semana actual.
   * 
   * 0: Domingo
   * 1: Lunes
   * 2: Martes
   * 3: Miércoles
   * 4: Jueves
   * 5: Viernes
   * 6: Sábado
   * 
   * @param desiredDayNumber El número del día deseado que se desea mostrar en el horario.
   */
  private getDayInWeek(desiredDayNumber: number): Date {
    let desiredDay: Date = new Date();
    let currentDayNumber: number = getDay(desiredDay);
    let daysOfDifference: number = 0;

    if (currentDayNumber > desiredDayNumber) {
      daysOfDifference = currentDayNumber - desiredDayNumber;
      desiredDay = subDays(startOfDay(new Date()), daysOfDifference);
    } else if (currentDayNumber < desiredDayNumber) {
      daysOfDifference = desiredDayNumber - currentDayNumber;
      desiredDay = addDays(startOfDay(new Date()), daysOfDifference);
    } else {
      desiredDay = startOfDay(new Date())
    }

    return desiredDay;
  }

  /**
   * Reacciona al evento de soltar un elemento dentro del Horario, tomando la información de la materia
   * que se desea agregar al calenario y guardándola en un arreglo que contiene la información de todas las materias
   * del horario.
   * 
   * @param event Evento de soltar una materia en el Horario
   */
  private dropClass(event: CdkDragDrop<Subject[]>) {
    let subjectToDisplay: Subject = event.previousContainer.data[event.previousIndex];

    // Mira si la clase no ha sido agregada al horario
    if (!this.calendarClasses.some(myClass => myClass._id === subjectToDisplay._id)) {
      let isOverlapped: boolean = false;
      let newClasses: CalendarEvent[];
      let classOverlapped = null;
      let arrayOverlapped;
      newClasses = Object.assign([],this.classes);

      for (let horary of subjectToDisplay.horarios) {
        let startHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaInicio / 3600);
        let endHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaFin / 3600);
        arrayOverlapped = this.checkOverlappingClasses(startHour, endHour);
        classOverlapped = arrayOverlapped["classOverlapped"]
        isOverlapped = arrayOverlapped["isOverLapped"];

        // Si la clase no se cruza con ninguna materia la guarda en un arreglo auxiliar de clases
        if(isOverlapped) {
          // Resuelve la promesa y si el valor es positivo intercambia las materias
            this.displaySelectingOptions(subjectToDisplay,classOverlapped).then(
              (value) => {
                if(value){
                  this.exchangeClasses(subjectToDisplay,classOverlapped);
                }
              }
            );
            break;
         } else {
          newClasses.push({
            start: startHour,
            end: endHour,
            color: colors.black,
            title: subjectToDisplay.nombre,
            id: subjectToDisplay._id,
            actions: this.actions
          });
        }
      }

      // Si ninguna materia se cruzó entonces iguala el arreglo de las clases al arreglo de las nuevas clases
      if (!isOverlapped) {
        this.classes = newClasses;
        this.calendarClasses.push(subjectToDisplay);
        this.refresh.next();
      }
    }
  }

  /**
   * Mira si la materia nueva que se agregará al horario se cruza con las otras materias
   * 
   * @param startHour Hora de inicio
   * @param endHour Hora de fin
   * 
   * Retorna un objeto con un booleano que dice si las materias se curzan o no y la clase que esta isncrita en el horario que impide inscribir la nueva
   */
  private checkOverlappingClasses(startHour: Date, endHour: Date) {
    let overlapped =null;

    return{
      "isOverLapped": 
      this.classes.some(function (myClass) {
      overlapped = myClass;

      return  areRangesOverlapping(startHour, endHour, myClass.start, myClass.end);
    }),
    "classOverlapped": overlapped,
  };
  }

  /**
   * Toma el nombre de un día de la semana y retorna el número equivalente al día de la semana.
   * 
   * @param name Nombre del día de la semana
   */
  private getDayNumberByName(name: string): number {
    let dayNumber: number = 0;

    if (name.toUpperCase() === 'domingo'.toUpperCase()) {
      return 0;
    } else if (name.toUpperCase() === 'lunes'.toUpperCase()) {
      return 1;
    } else if (name.toUpperCase() === 'martes'.toUpperCase()) {
      return 2;
    } else if (name.toUpperCase() === 'miércoles'.toUpperCase() || name.toUpperCase() === 'miercoles'.toUpperCase()) {
      return 3;
    } else if (name.toUpperCase() === 'jueves'.toUpperCase()) {
      return 4;
    } else if (name.toUpperCase() === 'viernes'.toUpperCase()) {
      return 5;
    } else if (name.toUpperCase() === 'sábado'.toUpperCase() || name.toUpperCase() === 'sabado'.toUpperCase()) {
      return 6;
    }

    return dayNumber;
  }

  /**
   * Maneja los eventos dentro de el horario
   * 
   * @param action Acción a la cual se va a responder
   * @param event Evento al cual se está respondiendo
   */
  private handleEvent(action: string, event: CalendarEvent): void {

    //
    if (action === 'Clicked') {
      let subjectToShowthis: Subject = this.calendarClasses.find(myClass => myClass._id === event.id);
      if(subjectToShowthis !== undefined){
        let dialogRef = this.dialog.open(ClassModalComponent, {
          data: { class: subjectToShowthis }
        });
      }
    }
    else if (action === 'Removed') {
      this.removeClass(event.id);
    }
  }

  /**
   * 
   * @param id Id de la materia que se removera
   * 
   * Se remueva la materia del horario
   */
  private removeClass(id) {
    let newClasses: CalendarEvent[];
    newClasses = Object.assign([], this.classes);
    newClasses = newClasses.filter(subject => subject.id != id);
    this.classes = newClasses;
    this.calendarClasses = this.calendarClasses.filter(subject => subject._id != id);
    this.refresh.next();
  }

  /**
   * 
   * @param tryingSubject Materia que se esta intentando inscribir
   * @param registeredSubject Materia que esta actualmente registrada
   * Crea el dialogo y retorna una promesa con el valor seleccionado por el usuario en el dialogo
   */
  async  displaySelectingOptions(tryingSubject,registeredSubject){
    const dialogRef = this.dialog.open(OverlapClassConfirmationDialog, {
      data: {
        "tryToAddClass" : tryingSubject,
        "addedClass": registeredSubject,
      }
    });
    
    return await (dialogRef.afterClosed().toPromise());

  }


  /**
   * 
   * @param newClass Clase que sera inscrita
   * @param oldClass Clase que sera removida
   * Remueve la calse vieja y agrega la clase nueva
   */
  private exchangeClasses(newClass,oldClass){
    this.removeClass(oldClass.id);
    let newClasses: CalendarEvent[];
    newClasses = Object.assign([],this.classes);
    for (let horary of newClass.horarios) {
      let startHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaInicio / 3600);
      let endHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaFin / 3600);
      newClasses.push({
        start: startHour,
        end: endHour,
        color: colors.black,
        title: newClass.nombre,
        id: newClass._id,
        actions: this.actions
      });
    }

    this.classes = newClasses;
    this.calendarClasses.push(newClass);
    this.refresh.next();
  }

  /**
   * Esta función genera automáticamente un id para cada nuevo bloque
   */
  private generateBlockID(): string{
    var flag= false;
    var id_rand = Math.random();
    this.listBlockID.forEach(blockId => {
      if(blockId == id_rand)
        flag = true;
    });

    if(flag){
      this.generateBlockID();
    }else{
      this.listBlockID[this.listBlockID.length]= id_rand;
      return ""+id_rand;
    }
  }

  /**
   * 
   * @param blockName Nombre del bloqueo suministrado por el usuario
   * @param day Día del bloqueo
   * @param initialHour Hora en la que inicia el bloqueo
   * @param finalHour Hora en la que finaliza el bloqueo
   */
  private addBlock(blockName: string, days: string, initialHour: number, finalHour: number): void {

    //En caso de no definir un nombre se colocá "Bloqueo" automáticamente
    if(blockName === undefined){
      blockName = "Bloqueo";
    }

    let newClasses: CalendarEvent[];
    newClasses = Object.assign([],this.classes);

    //Se genera un id para el bloqueo a crear
    var id_block= this.generateBlockID();

    let horarios= [];
    var horario;

    if(days.includes("-")){  //Esto se da en caso de que el usuario haya escogido más de un día
      days.split("-").forEach(day => {
        let startHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(day)), initialHour / 3600);
        let endHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(day)), finalHour / 3600);
        newClasses.push({
          start: startHour,
          end: endHour,
          color: colors.red,
          title: blockName,
          id: id_block,
          actions: this.actions,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        });
        horario = new Horary(day,initialHour,finalHour); 
        horarios.push(horario);
      });
    }else{      //Esto se da en el caso que el usuario haya escogido un solo día
      let startHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(days)), initialHour / 3600);
      let endHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(days)), finalHour / 3600);

      newClasses.push({
        start: startHour,
        end: endHour,
        color: colors.red,
        title: blockName,
        id: id_block,
        actions: this.actions,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      });

      horario = new Horary(days,initialHour,finalHour); 
      horarios.push(horario);

    }

    var newBlock = new Subject(id_block,'none',blockName,'none','none',0,0,0,'none','none','none','none','none','none',horarios,'none');
    

    //Si el bloqueo no se cruza se agrega al horario
    if(!this.checkOverlappedBlock(newBlock)){
      this.classes = newClasses;
      this.calendarBlocks.push(newBlock);
      this.refresh.next();
    }

  }

  //Esta función recibe los datos del modal del bloqueo
  receiveMessage($event) {
    this.message = $event

    this.addBlock(this.message['blockName'],this.message['daysBlock'],Number(this.message['selectedFromSeconds']),
      Number(this.message['selectedToSeconds']));
  }

  //Verifica que el bloqueo no se cruce con otros bloqueos, retorna true en caso de que el horario se cruce
  checkOverlappedBlock(block): boolean{

    let isOverlapped: boolean = false;
    let arrayOverlapped;

    for (let horary of block.horarios) {
      let startHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaInicio / 3600);
      let endHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaFin / 3600);
      arrayOverlapped = this.checkOverlappingClasses(startHour, endHour);
      isOverlapped = arrayOverlapped["isOverLapped"];
    }
    return isOverlapped;

  }
  
}



//Componente con el dialogo de confirmación
@Component({
  selector: 'overlap-class-confirmation-dialog',
  templateUrl: 'operlap-class-confirmation-dialog.html',
})
export class OverlapClassConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  private titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}
