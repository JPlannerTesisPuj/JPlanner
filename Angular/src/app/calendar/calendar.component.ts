import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTitleFormatter, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDay, areRangesOverlapping, addMinutes, endOfWeek, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from '../shared/model/Subject';
import { Subject as SubjectRXJS, fromEvent } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ClassModalComponent } from '../class-modal/class-modal.component';
import { HammerGestureConfig } from '@angular/platform-browser';
import { DataService } from '../shared/data.service';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { IterableDiffers } from '@angular/core';
import { Input } from '@angular/core';
import { DayViewHourSegment } from 'calendar-utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { CalendarBlock } from '../shared/model/CalendarBlock';
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

/**
 * Mide qué tan cercano está un número de otro. Se usa para saber cuántas casillas a la izquierda o derecha
 * el mouse se ha desplazado.
 * 
 * @param amount Posición actual del mouse en X respecto a la casilla a la cual se está evaluando
 * @param precision Ancho de la casilla desde la cual es está evaluando
 * @returns Número de casillas a la izquierda (número negativo) o derecha (número positivo) que el cursor ha recorrido
 */
function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

/**
 * Mide qué tan cercano está un número de otro. Se usa para saber cuántas casillas a hacia arriba o abajo
 * el mouse se ha desplazado.
 * 
 * @param amount Posición actual del mouse en Y respecto a la casilla a la cual se está evaluando
 * @param precision Número de minutos que representa la casiila
 * 
 * @returns Número de minutos hacia arriba (número negativo) o hacia abajo (número positivo) que el cursor ha recorrido
 */
function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision * 2) * precision;
}

/**
 * Clase que permite el uso de Tooltips en el calendario
 */
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ],
  styles: [
    `
      .disable-hover {
        pointer-events: none;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})

export class CalendarComponent implements OnInit {

  private locale: string = 'es';

  private view: CalendarView = CalendarView.Week;
  /** @var calendarView Enum */
  private calendarView = CalendarView;
  private viewDate: Date = new Date();
  private calendarClasses: Subject[] = [];
  private calendarBlocks: CalendarBlock[] = [];
  private inCalendar: string[] = [];
  private pru: string;


  private verticalMenuIndex: number = 0;
  private dragToCreateActive = false;
  private blockIdCount: number = 0;
  /** @var startSchoolYear Fecha de inicio del ciclo lectivo */
  private startSchoolYear: Date = new Date('2019-1-20 00:00:00');
  /** @var endSchoolYear Fecha de fin del ciclo lectivo */
  private endSchoolYear: Date = endOfWeek(new Date('2019-6-1 00:00:00'));
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
   * Variable que contiene un evento personalizado a cada una de las materias del calendario
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
   * Variable que contiene un evento personalizado a cada uno de los bloqueos del calendario
   */
  private actionsBlock: CalendarEventAction[] = [
    {
      label: '<i class="material-icons remove-icon"> clear </i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('BlockRemoved', event);
      }
    },
  ];

  /**
   * @var
   * Arreglo de alternativas de horario en donde se almancenan las clases que se utilizan en el calendario
   */
  private alternativeClasses: Array<CalendarEvent[]> = new Array<CalendarEvent[]>();
  /**
   * @var
   * Alternativa de horario actual seleccionada
   */
  private currentAlternative: number;
  /**
   * @var
   * Número de alternativas configurable
   */
  private numberOfAlternatives: number;

  private alternativeIterationArray: number[] = [];
  /**
   * @var
   * Arreglo que almacena los titulos de cada alternativa
   */
  private alternativeTitles: String[] = [];
  /**
   * @var
   * Arreglo donde se almacenan las calses de las alternativas que se usan en la logica interna
   */
  private alternativeCalendarClasses: Array<Subject[]> = new Array<Subject[]>();
  /**
   * Arreglo donde se almacenan las calses de las alternativas que se usan en la logica interna
   */
  private alternativeCalendarBlocks: Array<CalendarBlock[]> = new Array<CalendarBlock[]>();
  /** 
   * @var editBlockOption
   * Variable para el checkbox de edición:
   * false: Se editan todos los bloqueos creados en grupo
   * true: se edita sólo el bloqueo que se está editando
   */
  private editBlockOption: boolean = false;

  /**
   * @var Array donde se almacenan los sets con las classes cruzadas, por aternativa
   */
  private overLappedInCellByAlternative: Array<Set<any>>;

  /**
   * @var Set Collecion la cual tiene las clases cruzadas de la alternativa actual y el cual obserbamos cualquier cambio
   */
  @Input() private overLappedIds: Set<any>;

  /**
   * @var Object creado para subscripcion a diferencias en el array
  */
  private differ: any;
  private sholudDisplayDialog: any;
  constructor(
    differs: IterableDiffers,
    public dialog: MatDialog,
    private data: DataService,
    private readJSONFileService: ReadJsonFileService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.differ = differs.find([]).create(null);
  }

  /**
   * Subscripción a cambios en el numero de clases sobrepuestas de la alternativa actual
   */
  ngDoCheck() {
    const change = this.differ.diff(this.overLappedIds);
    if (change) {
      //Si hay mas de una clase sobrepuesta muestre el mensaje de conflicto
      if (change.length > 1) {
        this.sholudDisplayDialog[this.currentAlternative] = true;
      }
      //Si hay 0 o 1 clase sobrepuesta singifica que ya no hay clases sobrepuestas
      else if (change.length == 0 || change.length == 1) {
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
      let overLappedInAdded = this.getOverLapped(newClasses, subjectToDisplay);
      if (this.overLappedIds.size == 0) {
        this.addClass(newClasses, subjectToDisplay);
      } else {
        // Si hay dos materias en la casilla en la que se intenta meter la nueva materia muestre el popup
        if (overLappedInAdded.size >= 3) {
          let overlappedSubjectsInfo: Object[] = [];

          // Se busca la información de cada materia en el arreglo de materias que se muestran en el calendario
          // NOTA: Si se quiere eliminar bloqueos también se debe hacer la búsqueda en this.classes no en this.calendarClases
          overLappedInAdded.forEach(overlappedClassNumber => {
            let className: string = '';
            let classInfo: Subject = this.calendarClasses.find(myClass => myClass.numeroClase == overlappedClassNumber);

            // Se guarda el Nombre y el Número de Clase para mostrarlos en el modal
            if (classInfo != undefined) {
              className = classInfo.nombre;
            } else {
              className = subjectToDisplay.nombre;
            }
            overlappedSubjectsInfo.push({
              classNumber: overlappedClassNumber,
              title: className,
              toDelete: false
            });
          });

          this.displaySelectingOptions(subjectToDisplay, overlappedSubjectsInfo).then(
            //Respuesta del usuario al formulario
            (userResponse) => {
              if (userResponse) {
                // Mira cuáles clases del horario el usuario desea eliminar
                userResponse.forEach(subjectOverlapped => {
                  if (subjectOverlapped.toDelete) {
                    this.removeClass(subjectOverlapped.classNumber);
                  }
                });
                //this.exchangeClasses(subjectToDisplay, arrayClassesOverlapped);
              }
            }
          );
        }
        this.addClass(newClasses, subjectToDisplay);
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
    let overlapped: CalendarEvent = null;

    return {
      'isOverLapped':
        this.classes.some(function (myClass) {
          overlapped = myClass;
          return areRangesOverlapping(startHour, endHour, myClass.start, myClass.end);
        }),
      'classOverlapped': overlapped,
    };
  }

  /**
   * 
   * @param newClasses Arreglo auxiliar con las clases inscritas en el calendario
   * @param subjectToDisplay Clase que se ingresara
   * Retorna un arreglo con los ids de clases que tienen conflicto con la materia que se inscribira y almacena los ids de las clases en la variable
   * global overLappedIds
   */
  private getOverLapped(newClasses: CalendarEvent[], subjectToDisplay: Subject): Set<string | number> {
    let overLappedInSubject = new Set();
    for (let theClass of newClasses) {
      for (let horary of subjectToDisplay.horarios) {
        let startHour: Date = new Date(horary.horaInicio);
        let endHour: Date = new Date(horary.horaFin);
        if (areRangesOverlapping(startHour, endHour, theClass.start, theClass.end)) {
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
  addClass(newClasses: CalendarEvent[], subjectToDisplay: Subject) {
    for (let horary of subjectToDisplay.horarios) {
      let startHour: Date = new Date(horary.horaInicio);
      let endHour: Date = new Date(horary.horaFin);

      newClasses.push({
        start: startHour,
        end: endHour,
        color: colors.black,
        title: '<span class="cal-class-title">'+subjectToDisplay.nombre+'</span>'+'<p class="cal-class-size-alert">'+'Cupos Disponibles: '+subjectToDisplay.cuposDisponibles+'</p>',
        id: subjectToDisplay.numeroClase,
        actions: this.actions,
        meta: {
          tmpEvent: false
        },
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

    if (action === 'Clicked') {
      let subjectToShowthis: Subject = this.calendarClasses.find(myClass => myClass.numeroClase === event.id);
      let dialogRef = this.dialog.open(ClassModalComponent, {
        data: { class: subjectToShowthis }
      });
    } else if (action === 'Removed') {
      this.removeClass(event.id);
    } else if (action === 'BlockRemoved') {
      // Verifica si se debe eliminar sólo el bloqueo seleccionado o todo el grupo de bloqueos
      if (this.editBlockOption) {
        this.deleteBlockByID(event.id + '');
      } else {
        const parentID: string = this.calendarBlocks.find(myBlock => myBlock.id == event.id + '').parentID;
        const blocksToDelete: CalendarBlock[] = this.calendarBlocks.filter(myBlock => myBlock.parentID == parentID);

        blocksToDelete.forEach(myBlock => this.deleteBlockByID(myBlock.id));
      }
      this.refresh.next();
    }
  }

  /**
   * 
   * @param id Id de la materia que se removera
   * 
   * Se remueva la materia del horario
   */
  private removeClass(id: string | number) {

    //Remueve tambien de los ids sobrepuestos si es el caso
    this.removeOverLappedIds(id);

    let newClasses: CalendarEvent[];
    newClasses = Object.assign([], this.classes);
    newClasses = newClasses.filter(subject => subject.id != id);
    this.classes = newClasses;
    this.calendarClasses = this.calendarClasses.filter(subject => subject.numeroClase != id);
    this.alternativeClasses[this.currentAlternative] = Object.assign([], this.classes);;
    this.alternativeCalendarClasses[this.currentAlternative] = Object.assign([], this.calendarClasses);
    this.refresh.next();


  }

  /**
   * 
   * @param id Id de la materia que sera removida
   * Elimina del arreglo idsOverlapped los ids de clases que ya no son sobrepuestas al eliminar dicha materia
   */
  private removeOverLappedIds(id: string | number) {
    let classToBeRemoved = this.calendarClasses.find(value => {
      return value.numeroClase == id
    });
    let idsToRemove = new Set();
    for (let theClass of this.classes) {
      for (let horary of classToBeRemoved.horarios) {
        let startHour: Date = new Date(horary.horaInicio);
        let endHour: Date = new Date(horary.horaFin);
        if (areRangesOverlapping(startHour, endHour, theClass.start, theClass.end)) {
          idsToRemove.add(theClass.id);
          break;
        }
      }
    }

    if (idsToRemove.size < 3) {
      idsToRemove.forEach(value => this.overLappedIds.delete(value));
    } else {
      this.overLappedIds.delete(id);
    }
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
      if (registeredSubject.classNumber != tryingSubject.numeroClase) {
        removedClassesTitles += registeredSubject['title'] + ', ';
      }
    }
    removedClassesTitles = removedClassesTitles.slice(0, -2);

    const dialogRef = this.dialog.open(OverlapClassConfirmationDialog, {
      data: {
        'tryToAddClass': tryingSubject,
        'addedClasses': removedClassesTitles,
        'subjectsToChoose': registeredSubjects
      },
      disableClose: true
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

    this.addClass(newClasses, newClass);

  }

  /**
   * Reacciona al cambio entre los radio buttons de las alternativas
   */
  private onItemChange(alternativeValue) {
    this.currentAlternative = alternativeValue;
    if (this.alternativeClasses[this.currentAlternative] === undefined) {
      this.alternativeClasses[this.currentAlternative] = new Array<CalendarEvent>();
      this.alternativeCalendarClasses[this.currentAlternative] = new Array<Subject>();
      this.alternativeCalendarBlocks[this.currentAlternative] = new Array<CalendarBlock>();
    }

    this.classes = this.alternativeClasses[this.currentAlternative];
    this.calendarClasses = this.alternativeCalendarClasses[this.currentAlternative];
    this.calendarBlocks = this.alternativeCalendarBlocks[this.currentAlternative];
    this.overLappedIds = this.overLappedInCellByAlternative[this.currentAlternative];
  }
  /**
   * Inicializa los titulos de las alternativas segun la configuración de la variable numberOfAlternatives
   */
  private initTitles() {
    for (let i = 1; i <= this.numberOfAlternatives; i++) {
      this.alternativeTitles[i - 1] = 'Alternativa ' + i;
      this.alternativeIterationArray[i - 1] = i - 1;
    }

  }

  // ---------------------------------------------------------------------------------------------
  // CREAR BLOQUEO
  // ---------------------------------------------------------------------------------------------

  /**
   * Evento que responde cuando se mantiene presionado el click del mouse en el calendario. Crea un bloqueo
   * en el día y la hora seleccionada y lo replica para todos los días con el mismo nombre en todas las semanas
   * del ciclo lectivo.
   * 
   * @param segment 
   * @param mouseTouchDownEvent 
   * @param segmentElement 
   */
  private startDragToCreateBlock(
    segment: DayViewHourSegment,
    mouseTouchDownEvent: MouseEvent | TouchEvent,
    segmentElement: HTMLElement
  ) {

    // Mira si el evento es desde un computador o desde un celular
    let eventMove: string = 'mousemove';
    let eventEnd: string = 'mouseup';

    if(mouseTouchDownEvent.type == 'touchstart') {
      eventMove = 'touchmove';
      eventEnd = 'touchend';
    }

    // Fecha donde fue seleccionado crear el bloqueo
    let firstBlockDate: Date = segment.date;
    // Variable que representa el ID general de un grupo de bloqueos
    let blockParentID: string = '';

    // Se coge el día que fue seleccionado para crear el bloqueo y se lo ubica en la primera semana del ciclo lectivo
    if (firstBlockDate > this.startSchoolYear) {
      while (firstBlockDate > this.startSchoolYear) {
        firstBlockDate = subWeeks(firstBlockDate, 1);
      }
      if (firstBlockDate < this.startSchoolYear) {
        firstBlockDate = addWeeks(firstBlockDate, 1);
      }
    } else if (firstBlockDate < this.startSchoolYear) {
      while (firstBlockDate < this.startSchoolYear) {
        firstBlockDate = addWeeks(firstBlockDate, 1);
      }
    }

    blockParentID = 'block_' + this.blockIdCount;
    const dragToSelectEvent: CalendarEvent = this.createBlockCalendarEvent(firstBlockDate, addHours(firstBlockDate, 1), blockParentID + '__0__0', 'Bloqueo ' + (this.blockIdCount + 1), blockParentID);

    // Agrega los bloqueos de los días en todas las semanas
    for (let weekToAddBlock = this.startSchoolYear, contWeeks = 0; weekToAddBlock <= this.endSchoolYear; weekToAddBlock = addWeeks(weekToAddBlock, 1), contWeeks++) {
      /**
       * @var blockIDWeek 
       * ID del bloqueo a agregar: block_[ContadorDeBLoqueos]__[DíaEnElQueSeAgrega]__[SemanaDelCicloLectivo]
       */
      let blockIDWeek: string = blockParentID + '__0__' + contWeeks;
      let startDayOnWeek: Date = addWeeks(firstBlockDate, contWeeks);
      let endDayOnWeek: Date = addWeeks(addHours(firstBlockDate, 1), contWeeks);

      // Mira si el bloqueo que se está agregando está en los rangos de días desplazados por el mouse y si el bloqueo ya existe
      this.createBlockCalendarEvent(startDayOnWeek, endDayOnWeek, blockIDWeek, 'Bloqueo ' + this.blockIdCount, blockParentID);
    }

    this.blockIdCount++;
    // Se toma la posición del cuadro que fue seleccionado para agregar el bloqueo
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    // Se toma como base la primera semana del ciclo lectivo para agregar los bloqueos
    const startOfView = startOfWeek(firstBlockDate);
    const endOfView = endOfWeek(firstBlockDate);

    fromEvent(document, eventMove)
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refreshCal();
        }),
        takeUntil(fromEvent(document, eventEnd))
      )
      .subscribe((mouseTouchMoveEvent: MouseEvent | TouchEvent) => {

        let clientX: number = 0;
        let clientY: number = 0;
        if(mouseTouchMoveEvent instanceof TouchEvent) {
          clientX = mouseTouchMoveEvent.changedTouches[0].clientX;
          clientY = mouseTouchMoveEvent.changedTouches[0].clientY;
        } else {
          clientX = mouseTouchMoveEvent.clientX;
          clientY = mouseTouchMoveEvent.clientY;
        }

        let segmentMinutes = 70;

        // Toma los minutos que el mouse se ha desplazado hacia arriba o hacia abajo
        let minutesDiff = ceilToNearest(
          clientY - segmentPosition.top,
          segmentMinutes
        );
        if (minutesDiff == 0 || minutesDiff == -0) {
          minutesDiff = segmentMinutes;
        }
        // Toma los días que el mouse se ha desplazado hacia la izquierda o derecha
        const daysDiff =
          floorToNearest(
            clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        // Calcula la nueva hora de inicio y de fin del bloqueo
        let newEnd = addHours(firstBlockDate, minutesDiff / segmentMinutes);
        let newStart = firstBlockDate;

        if (newEnd < firstBlockDate && newEnd > startOfView) {
          newStart = newEnd;
          newEnd = firstBlockDate;
        }

        // Contadores para agregar el bloqueo en otros días en el calendario, por defecto agrega a la derecha
        let contDays = 0;
        let contDaysEnd = daysDiff;
        // Contadores para eliminar los bloqueos fuera de rango, por defecto elimina a la izquierda
        let deleteFromIndex = -1;
        let deleteToIndex = -6;

        // Cambia el valor de los contadores para agregar a la izquierda y eliminar a la derecha
        if (daysDiff < 0) {
          contDays = daysDiff;
          contDaysEnd = 0;
          deleteFromIndex = 1;
          deleteToIndex = 6;
        }

        this.deleteBlocksNotInRage(
          contDays,
          contDaysEnd,
          newStart,
          newEnd,
          blockParentID
        );

        // Agrega los bloqueos hacia los lados
        for (; contDays <= contDaysEnd; contDays++) {
          let startDay: Date = addDays(newStart, contDays);
          let endDay: Date = addDays(newEnd, contDays);

          // Agrega los bloqueos de los días en todas las semanas
          for (let weekToAddBlock = this.startSchoolYear, contWeeks = 0; weekToAddBlock <= this.endSchoolYear; weekToAddBlock = addWeeks(weekToAddBlock, 1), contWeeks++) {
            /**
             * @var blockIDWeek 
             * ID del bloqueo a agregar: block_[ContadorDeBLoqueos]__[DíaEnElQueSeAgrega]__[SemanaDelCicloLectivo]
             */
            let blockIDWeek: string = blockParentID + '__' + contDays + '__' + contWeeks;
            let startDayOnWeek: Date = addWeeks(startDay, contWeeks);
            let endDayOnWeek: Date = addWeeks(endDay, contWeeks);

            // Mira si el bloqueo que se está agregando está en los rangos de días desplazados por el mouse y si el bloqueo ya existe
            if (!this.calendarBlocks.some(myBlock => myBlock.id == blockIDWeek) &&
              startDay > startOfView && startDay < endOfView &&
              endDay > startOfView && endDay < endOfView) {
              this.createBlockCalendarEvent(startDayOnWeek, endDayOnWeek, blockIDWeek, 'Bloqueo ' + this.blockIdCount, blockParentID);
            } else {
              this.updateBlockCalendarEvent(blockIDWeek, startDayOnWeek, endDayOnWeek);
            }
          }
        }

        // ACtualiza el bloqueo principal
        this.updateBlockCalendarEvent(dragToSelectEvent.id + '', newStart, newEnd);
        this.refreshCal();
      });
  }
 
  /**
   * Crea un bloqueo en el calendario
   * 
   * @param startDate Fecha de inicio del bloqueo
   * @param endDate Fecha de fin del bloqueo
   * @param blockIdentifier ID del bloqueo
   * @param blockTitle Título del bloqueo
   * @param blockParentID ID que representa el grupo al cual pertenece el bloqueo
   * @returns CalendarEvent Retorna un nuevo evento en el calendario.
   */
  private createBlockCalendarEvent(startDate: Date, endDate: Date, blockIdentifier: string, blockTitle: string, blockParentID: string) {
    let blockIndexToAdd: number;
    let newBlock: CalendarEvent = null;

    // Busca si el bloqueo ya existe
    blockIndexToAdd = this.calendarBlocks.findIndex(myBlock => myBlock.id == blockIdentifier);

    // Si no hay fecha final entonces la hora final será una hora después de la hora final
    if (endDate == undefined) {
      endDate = addHours(startDate, 1);
    }

    // Si el bloqueo no existe o no se cruza con ninguna vlase u otro bloqueo entonces lo crea
    if (blockIndexToAdd == -1 && !this.checkOverlappingClasses(startDate, endDate).isOverLapped) {
      newBlock = {
        start: startDate,
        end: endDate,
        color: colors.red,
        title: blockTitle,
        id: blockIdentifier,
        actions: this.actionsBlock,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        meta: {
          tmpEvent: false
        },
        cssClass: "cal-block"
      };

      this.classes = [...this.classes, newBlock];
      this.calendarBlocks.push(
        new CalendarBlock(
          newBlock.id + '',
          newBlock.start,
          newBlock.end,
          blockParentID
        )
      );
      this.alternativeClasses[this.currentAlternative] = Object.assign([], this.classes);
      this.alternativeCalendarBlocks[this.currentAlternative] = Object.assign([], this.calendarBlocks);
    }

    return newBlock;
  }

  /**
   * Mira si el bloqueo se cruza con alguna clase u otros bloqueos que no sea él mismo
   * 
   * @param blockID ID del bloqueo
   * @param startDay Fecha de inicio del bloqueo
   * @param endDay Fecha final del bloqueo
   * @returns boolean
   */
  private checkBlockOverlapped(blockID: string, startDay: Date, endDay: Date) {
    return this.classes.some(myClass => areRangesOverlapping(startDay, endDay, myClass.start, myClass.end) && myClass.id != blockID);
  }

  /**
   * Actualiza el bloqueo en el calendario y en el arreglo de bloqueos
   * 
   * @param blockID ID del bloqueo
   * @param startDay Fecha de inicio del bloqueo
   * @param endDay Fecha final del bloqueo
   */
  private updateBlockCalendarEvent(blockID: string, startDay: Date, endDay: Date) {
    let blockIndexToEdit: number;

    blockIndexToEdit = this.calendarBlocks.findIndex(myBlock => myBlock.id == blockID);

    if (blockIndexToEdit != -1 && !this.checkBlockOverlapped(blockID, startDay, endDay)) {
      this.calendarBlocks[blockIndexToEdit].startHour = startDay;
      this.calendarBlocks[blockIndexToEdit].endHour = endDay;
    }

    blockIndexToEdit = this.classes.findIndex(myBlock => myBlock.id == blockID);
    if (blockIndexToEdit != -1 && !this.checkBlockOverlapped(blockID, startDay, endDay)) {
      this.classes[blockIndexToEdit].start = startDay;
      this.classes[blockIndexToEdit].end = endDay;
    }
  }

  /**
   * Actualiza la vista del calendario
   */
  private refreshCal() {
    this.classes = [...this.classes];
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Elimina los bloqueos en todas las semanas del ciclo lectivo en un rango de días específicos
   * 
   * @param fromDay Día inicial
   * @param toDay Día final
   * @param fromDate Fecha inicial
   * @param toDate Fecha final
   * @param blockID 
   */
  private deleteBlocksNotInRage(fromDay: number, toDay: number, fromDate: Date, toDate: Date, blockID: string) {
    let startOfView = startOfWeek(this.startSchoolYear);
    let endOfView = endOfWeek(this.startSchoolYear);
    let startDay: Date;
    let endDay: Date;

    for (let contDays = -6; contDays <= 6; contDays++) {
      let blockDayIDToDelete: string = blockID + '__' + contDays;
      startDay = addDays(fromDate, contDays);
      endDay = addDays(toDate, contDays);

      if ((contDays < fromDay || contDays > toDay) && contDays != 0 &&
        startDay > startOfView && startDay < endOfView &&
        endDay > startOfView && endDay < endOfView) {

        for (let weekToAddBlock = this.startSchoolYear, contWeeks = 0; weekToAddBlock <= this.endSchoolYear; weekToAddBlock = addWeeks(weekToAddBlock, 1), contWeeks++) {
          let blockWeeklyIDToDelete = blockID + '__' + contDays + '__' + contWeeks;
          this.deleteBlockByID(blockWeeklyIDToDelete);
        }
      }
    }
  }

  /**
   * Elimina un bloqueo por su ID
   * 
   * @param blockIdToDelete ID del bloqueo a eliminar
   */
  private deleteBlockByID(blockIdToDelete: string) {
    let blockIndexToDelete: number;
    blockIndexToDelete = this.calendarBlocks.findIndex(myBlock => myBlock.id == blockIdToDelete);

    if (blockIndexToDelete != -1) {
      this.calendarBlocks.splice(blockIndexToDelete, 1);
    }

    blockIndexToDelete = this.classes.findIndex(myBlock => myBlock.id == blockIdToDelete);
    if (blockIndexToDelete != -1) {
      this.classes.splice(blockIndexToDelete, 1);
    }

    this.alternativeClasses[this.currentAlternative] = Object.assign([], this.classes);
    this.alternativeCalendarBlocks[this.currentAlternative] = Object.assign([], this.calendarBlocks);
  }

  /**
   * Actualiza un bloqueo al ser redimensionado o movido
   * 
   * @param event Bloqueo a actualizar
   */
  private eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.updateBlockCalendarEvent(event.id + '', newStart, newEnd);
    this.refresh.next();
  }
  private titleCaseWord(word: string) {
    if (!word) {
      return word;
    }

    return word[0].toUpperCase() + word.substr(1).toLowerCase();
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
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  private conflictExists: boolean = false;

  private titleCaseWord(word: string) {
    if (!word) {
      return word;
    }

    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  private doNotDeleteSubjects(subjectsToDelete: any[]) {
    subjectsToDelete.forEach(subject => {
      subject.toDelete = false;
    });
  }

  private verifyOverlappedSubjects() {
    let contSubjectsToLeave: number = 0;

    this.data.subjectsToChoose.forEach(subject => {
      if (!subject.toDelete) {
        contSubjectsToLeave++;
      }
    });

    if (contSubjectsToLeave > 2) {
      this.conflictExists = true;
    } else {
      this.conflictExists = true;
      this.dialogRef.close(this.data.subjectsToChoose);
    }
  }
}
