import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDay, areRangesOverlapping } from 'date-fns';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from '../shared/model/Subject';
import { Subject as SubjectRXJS } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ClassModalComponent } from '../class-modal/class-modal.component';
import { HammerGestureConfig } from '@angular/platform-browser';
import { DataService } from '../shared/data.service';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { IterableDiffers } from '@angular/core';
import { Input } from '@angular/core';
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
  /** @var calendarView Enum */
  private calendarView = CalendarView;
  private viewDate: Date = new Date();
  private calendarClasses: Subject[] = [];
  private inCalendar: string[] = [];
  private pru: string;


  private verticalMenuIndex: number = 0;
  /**
   * @var
   * Esta variable contiene las clases que se mostrarán en el horario. Los atributos cada clase que se muestra son:
   * start: fecha de inicio de la materia, incluye la hora en que inicia la clase y el día de la semana en que se tomará.
   * end: fecha de fin de la materia, incluye la hora en que finaliza la clase y el día de la semana en que se tomará.
   * color: es el color con el que se pintará la materia en el horario.
   * title: es el título de la clase que aparecerá en el bloque del horario de la materia
   */
  private classes: CalendarEvent[] = [];

  private refresh: SubjectRXJS<any> = new SubjectRXJS();
  /**
   * @var
   * Variable que contiene un evento personalizado a cada uno de las materias del calendario
   */
  private actions: CalendarEventAction[] = [
    {
      label: '<i class="material-icons remove-icon"> clear </i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Removed', event);
      }
    },
  ];

  /**
   * @var
   * Arreglo de alternativas de horario en donde se almancenan las clases que se utilizan en el calendario
   */
  private alternativeClasses : Array <CalendarEvent[]> = new Array<CalendarEvent[]>();
  /**
   * @var
   * Alternativa de horario actual seleccionada
   */
  private currentAlternative : number;
  /**
   * Número de alternativas configurable
   */
  private numberOfAlternatives : number;

  private alternativeIterationArray : number[] = [];
  /**
   * Arreglo que almacena los titulos de cada alternativa
   */
  private alternativeTitles : String[] = [];
  /**
   * Arreglo donde se almacenan las calses de las alternativas que se usan en la logica interna
   */
  private alternativeCalendarClasses: Array<Subject[]> = new Array<Subject[]>();

  private overLappedInCellByAlternative : any ;
  @Input() overLappedIds:any = [];
  differ: any;
  private sholudDisplayDialog: any ;
  constructor(differs: IterableDiffers,public dialog: MatDialog, private data: DataService, private readJSONFileService: ReadJsonFileService) {
    this.differ = differs.find([]).create(null);
   }
   ngDoCheck() {
    const change = this.differ.diff(this.overLappedIds);
    if (change) {
      console.log(change.length);
      console.log(this.overLappedIds);
      if(change.length >1){
        this.sholudDisplayDialog[this.currentAlternative] = true;
      }else if( change.length == 0 || change.length == 1 ){
        this.sholudDisplayDialog[this.currentAlternative] = false;
        this.overLappedIds.clear();
      }
    }
   }

  ngOnInit() {
    //Inicializa el numero de alternativas, el arreglo de titulos y la alterativa escogida por defecto
    this.numberOfAlternatives = 6;
    this.overLappedInCellByAlternative = new Array(this.numberOfAlternatives);
    this.overLappedInCellByAlternative.fill(new Set());
    this.sholudDisplayDialog = new Array(this.numberOfAlternatives);
    this.sholudDisplayDialog.fill(false);
    this.initTitles();
    this.onItemChange(0);
  
        /**
     * Se suscribe al envío de mensajes de si ha habido una búsqueda o no, en caso de que
     * haya una búsqueda cambia el index del menú de íconos para que este cambie de pestaña.
     */
    let filter: any;
    this.data.currentMessage.subscribe(message => {
      filter = message;
      if (filter['type'] == 'filter') {
        this.verticalMenuIndex = 1;
      }
    });
  }

  /**
   * Captura el evento swipe cuando este se realice en el calendar: left o right
   * 
   * @param evt Evento de movimiento
   */
  onSwipe(evt: any) {
    const verticalSwipeMove = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
    if (verticalSwipeMove == 'right') {
      // Left Swipe: devolverse un dia, es decir, substraer 1 dia al dia actual mostrado.
      this.viewDate = subDays(this.viewDate, 1);
    } else if (verticalSwipeMove == 'left') {
      // Right Swipe: aumentar un dia, es decir, aumentar 1 dia al dia actual mostrado.
      this.viewDate = addDays(this.viewDate, 1);
    }
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
   * que se desea agregar al calendario y guardándola en un arreglo que contiene la información de todas las materias
   * del horario.
   * 
   * @param event Evento de soltar una materia en el Horario
   */
  private dropClass(event: CdkDragDrop<Subject[]>) {
    let subjectToDisplay: Subject = event.previousContainer.data[event.previousIndex];

    // Mira si la clase no ha sido agregada al horario
    if (!this.calendarClasses.some(myClass => myClass.numeroClase == subjectToDisplay.numeroClase)) {
      let newClasses: CalendarEvent[];
      newClasses = Object.assign([], this.classes);
      for (let horary of subjectToDisplay.horarios) {
        let startHour: Date = new Date(horary.horaInicio);
        let endHour: Date = new Date(horary.horaFin);
      }
      let overLappedInAdded = this.getOverLapped(newClasses,subjectToDisplay).size;
      if (this.overLappedIds.length == 0) {
        this.addClass(newClasses,subjectToDisplay);
      } else {
          // Si hay dos materias en la casilla en la que se intenta meter la nueva materia muestre el popup
          if (overLappedInAdded==3) {
          this.displaySelectingOptions(subjectToDisplay, ["remplaza con la lista"]).then(
            //Respuesta del usuario al formulario
            (userResponse) => {
              if (userResponse) {
                //this.exchangeClasses(subjectToDisplay, arrayClassesOverlapped);
              }
            }
          );
        }
        this.addClass(newClasses, subjectToDisplay);
    }
  }
}

private getOverLapped(newClasses : CalendarEvent[],subjectToDisplay : Subject){
  let overLappedInSubject = new Set();
  for(let theClass of newClasses){
    for (let horary of subjectToDisplay.horarios) {
      let startHour: Date = new Date(horary.horaInicio);
      let endHour: Date = new Date(horary.horaFin);
     if(areRangesOverlapping(startHour,endHour,theClass.start,theClass.end)){
        this.overLappedIds.add(subjectToDisplay.numeroClase);
        this.overLappedIds.add(theClass.id);
        overLappedInSubject.add(theClass.id);
        overLappedInSubject.add(subjectToDisplay.numeroClase);
        break;
      }
    }
  }
  return overLappedInSubject;
}
 /**
   * 
   * @param newClasses Arreglo auxiliar en el cual se almacenan las clases
   * @param subjectToDisplay Nueva clase que se agregara
   * El metodo agrega una materia nueva al calendario
   */
  addClass(newClasses : CalendarEvent[],subjectToDisplay : Subject){
    

    for (let horary of subjectToDisplay.horarios) {
      let startHour: Date = new Date(horary.horaInicio);
        let endHour: Date = new Date(horary.horaFin);

      newClasses.push({
        start: startHour,
        end: endHour,
        color: colors.black,
        title: subjectToDisplay.nombre,
        id: subjectToDisplay.numeroClase,
        actions: this.actions
      });
    }
      this.classes = newClasses;
      this.alternativeClasses[this.currentAlternative] = Object.assign([], this.classes);;
      this.calendarClasses.push(subjectToDisplay);
      
      this.alternativeCalendarClasses[this.currentAlternative] = Object.assign([], this.calendarClasses);
      this.refresh.next();
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
      let subjectToShowthis: Subject = this.calendarClasses.find(myClass => myClass.numeroClase === event.id);
      let dialogRef = this.dialog.open(ClassModalComponent, {
        data: { class: subjectToShowthis }
      });
    } else if (action === 'Removed') {
      this.removeClass(event.id);
    }
  }

  /**
   * 
   * @param id Id de la materia que se removera
   * 
   * Se remueva la materia del horario
   */
  private removeClass(id: string | number) {
    let newClasses: CalendarEvent[];
    newClasses = Object.assign([], this.classes);
    newClasses = newClasses.filter(subject => subject.id != id);
    this.classes = newClasses;
    this.calendarClasses = this.calendarClasses.filter(subject => subject.numeroClase != id);
    this.alternativeClasses[this.currentAlternative] = Object.assign([], this.classes);;
    this.alternativeCalendarClasses[this.currentAlternative] = Object.assign([], this.calendarClasses);
    this.refresh.next();

      //Remueve tambien de los ids sobrepuestos si es el caso
      this.overLappedIds.delete(id);
  }

  /**
   * 
   * @param tryingSubject Materia que se esta intentando inscribir
   * @param registeredSubject Materia que esta actualmente registrada
   * @returns Crea el diálogo y retorna una promesa con el valor seleccionado por el usuario en el diálogo
   */
  private async displaySelectingOptions(tryingSubject: Subject, registeredSubjects: any[]) {
    let removedClassesTitles: string = '';
    for (let registeredSubject of registeredSubjects) {
      removedClassesTitles += registeredSubject['title'] + ', ';
    }
    removedClassesTitles = removedClassesTitles.slice(0, -2);
    const dialogRef = this.dialog.open(OverlapClassConfirmationDialog, {
      data: {
        'tryToAddClass': tryingSubject,
        'addedClasses': removedClassesTitles,
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
  private exchangeClasses(newClass: Subject, oldClass: CalendarEvent[]) {
    for (let oldClasses of oldClass) {
      this.removeClass(oldClasses.id);
    }
    let newClasses: CalendarEvent[];
    newClasses = Object.assign([], this.classes);

    this.addClass(newClasses,newClass);
    
  }

  /**
   * Reacciona al cambio entre los radio buttons de las alternativas
   */
  private onItemChange(alternativeValue){
    this.currentAlternative = alternativeValue;
       if(this.alternativeClasses[this.currentAlternative] === undefined){
      this.alternativeClasses[this.currentAlternative] = new Array<CalendarEvent>();
      this.alternativeCalendarClasses[this.currentAlternative]= new Array<Subject>();
    }
    this.classes = this.alternativeClasses[this.currentAlternative];    
    this.calendarClasses = this.alternativeCalendarClasses[this.currentAlternative];
    this.overLappedIds = this.overLappedInCellByAlternative[this.currentAlternative];
  }
  /**
   * Inicializa los titulos de las alternativas segun la configuración de la variable numberOfAlternatives
   */
  private initTitles(){
    for(let i=1 ; i<=this.numberOfAlternatives;i++){
      this.alternativeTitles[i-1] = 'Alternativa ' + i;
      this.alternativeIterationArray[i-1] = i-1;
    }
    
  }
  
}



/**
 * Componente con el dialogo de confirmación
 */
@Component({
  selector: 'overlap-class-confirmation-dialog',
  templateUrl: 'overlap-class-confirmation-dialog.html',
})

export class OverlapClassConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  private titleCaseWord(word: string) {
    if (!word){
      return word;
    }

    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}
