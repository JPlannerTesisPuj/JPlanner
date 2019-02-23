import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTitleFormatter, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDay, areRangesOverlapping, addMinutes, endOfWeek, startOfWeek } from 'date-fns';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from '../shared/model/Subject';
import { Subject as SubjectRXJS, fromEvent } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ClassModalComponent } from '../class-modal/class-modal.component';
import { HammerGestureConfig } from '@angular/platform-browser';
import { DataService } from '../shared/data.service';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { DayViewHourSegment } from 'calendar-utils';
import { finalize, takeUntil } from 'rxjs/operators';
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

//--------------------------------------------------------------------------------
function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision * 2) * precision;
}

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

export class CalendarBlock {
  public id: string;
  public startHour: Date;
  public endHour: Date;

  constructor(
    private nID: string,
    private nStartHour: Date,
    private nEndHour: Date,
  ) {
    this.id = nID;
    this.startHour = nStartHour;
    this.endHour = nEndHour;
  }
}
//--------------------------------------------------------------------------------

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private view: CalendarView = CalendarView.Week;
  /** @var calendarView Enum */
  private calendarView = CalendarView;
  private viewDate: Date = new Date();
  private calendarClasses: Subject[] = [];
  private calendarBlocks: CalendarBlock[] = [];
  private verticalMenuIndex: number = 0;
  private dragToCreateActive = false;
  private blockID: number = 0;
  /** @var startSchoolYear Fecha de inicio del ciclo lectivo */
  private startSchoolYear: Date = new Date('2019-1-20 00:00:00');
  /** @var endSchoolYear Fecha de fin del ciclo lectivo */
  private endSchoolYear: Date = new Date('2019-6-1 00:00:00');
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
  private alternativeClasses: Array<CalendarEvent[]> = new Array<CalendarEvent[]>();
  /**
   * @var
   * Alternativa de horario actual seleccionada
   */
  private currentAlternative: number;
  /**
   * Número de alternativas configurable
   */
  private numberOfAlternatives: number;

  private alternativeIterationArray: number[] = [];
  /**
   * Arreglo que almacena los titulos de cada alternativa
   */
  private alternativeTitles: String[] = [];
  /**
   * Arreglo donde se almacenan las calses de las alternativas que se usan en la logica interna
   */
  private alternativeCalendarClasses: Array<Subject[]> = new Array<Subject[]>();


  constructor(
    public dialog: MatDialog,
    private data: DataService,
    private readJSONFileService: ReadJsonFileService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    //Inicializa el numero de alternativas, el arreglo de titulos y la alterativa escogida por defecto
    this.numberOfAlternatives = 6;
    this.initTitles();
    this.onItemChange(0);

    this
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
    if (!this.calendarClasses.some(myClass => myClass._id == subjectToDisplay._id)) {
      let isOverlapped: boolean = false;
      let newClasses: CalendarEvent[];
      let classOverlapped: CalendarEvent = null;
      let arrayOverlapped: any;
      newClasses = Object.assign([], this.classes);
      let arrayClassesOverlapped: CalendarEvent[] = [];
      for (let horary of subjectToDisplay.horarios) {
        let startHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaInicio / 3600);
        let endHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaFin / 3600);
        arrayOverlapped = this.checkOverlappingClasses(startHour, endHour);
        classOverlapped = arrayOverlapped['classOverlapped']
        isOverlapped = arrayOverlapped['isOverLapped'];
        if (isOverlapped && !arrayClassesOverlapped.some((subject) => subject.id == classOverlapped.id)) {
          arrayClassesOverlapped.push(classOverlapped);

        }
      }
      if (arrayClassesOverlapped.length == 0) {
        this.addClass(newClasses, subjectToDisplay);
      } else {
        this.displaySelectingOptions(subjectToDisplay, arrayClassesOverlapped).then(
          //Respuesta del usuario al formulario
          (userResponse) => {
            if (userResponse) {
              this.exchangeClasses(subjectToDisplay, arrayClassesOverlapped);
            }
          }
        );
      }
    }
  }

  /**
    * 
    * @param newClasses Arreglo auxiliar en el cual se almacenan las clases
    * @param subjectToDisplay Nueva clase que se agregara
    * El metodo agrega una materia nueva al calendario
    */
  addClass(newClasses: CalendarEvent[], subjectToDisplay: Subject) {
    for (let horary of subjectToDisplay.horarios) {
      let startHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaInicio / 3600);
      let endHour: Date = addHours(this.getDayInWeek(this.getDayNumberByName(horary.dia)), horary.horaFin / 3600);

      newClasses.push({
        start: startHour,
        end: endHour,
        color: colors.black,
        title: subjectToDisplay.nombre,
        id: subjectToDisplay._id,
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
    this.calendarClasses = this.calendarClasses.filter(subject => subject._id != id);
    this.alternativeClasses[this.currentAlternative] = Object.assign([], this.classes);;
    this.alternativeCalendarClasses[this.currentAlternative] = Object.assign([], this.calendarClasses);
    this.refresh.next();
  }

  /**
   * 
   * @param tryingSubject Materia que se esta intentando inscribir
   * @param registeredSubject Materia que esta actualmente registrada
   * @returns Crea el diálogo y retorna una promesa con el valor seleccionado por el usuario en el diálogo
   */
  private async displaySelectingOptions(tryingSubject: Subject, registeredSubjects: CalendarEvent[]) {
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
    }
    this.classes = this.alternativeClasses[this.currentAlternative];
    this.calendarClasses = this.alternativeCalendarClasses[this.currentAlternative];
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

  private startDragToCreate(
    segment: DayViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {

    let firstBlockDate: Date = segment.date;

    if (firstBlockDate > this.startSchoolYear) {
      while (firstBlockDate > this.startSchoolYear) {
        firstBlockDate = subDays(firstBlockDate, 7);
      }
      if (firstBlockDate < this.startSchoolYear) {
        firstBlockDate = addDays(firstBlockDate, 7);
      }
    } else if (firstBlockDate < this.startSchoolYear) {
      while (firstBlockDate < this.startSchoolYear) {
        firstBlockDate = addDays(firstBlockDate, 7);
      }
    }

    const dragToSelectEvent: CalendarEvent = this.createBlockCalendarEvent(firstBlockDate, undefined, 'block_' + this.blockID, 'Bloqueo ' + this.blockID);

    for (let weekToAddBlock = this.startSchoolYear, contWeeks = 1; weekToAddBlock < subDays(this.endSchoolYear, 7); weekToAddBlock = addDays(weekToAddBlock, 7), contWeeks++) {
      let blockIDWeek: string = dragToSelectEvent.id + '__' + this.blockID + '__' + contWeeks;
      let startDayOnWeek: Date = addDays(dragToSelectEvent.start, contWeeks * 7);
      let endDayOnWeek: Date = addHours(startDayOnWeek, 1);

      this.createBlockCalendarEvent(startDayOnWeek, endDayOnWeek, blockIDWeek, 'Bloqueo ' + this.blockID);
    }

    this.blockID++;
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;

    const startOfView = startOfWeek(firstBlockDate);
    const endOfView = endOfWeek(firstBlockDate);

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refreshCal();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          60
        );
        //console.log(mouseMoveEvent.clientY - segmentPosition.top);
        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;
        // console.log(daysDiff);

        const newEnd = addMinutes(firstBlockDate, minutesDiff);
        // console.log(newEnd)
        if (newEnd > firstBlockDate && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        } else if (newEnd < firstBlockDate && newEnd > startOfView) {
          dragToSelectEvent.end = firstBlockDate;
          dragToSelectEvent.start = newEnd;
        }

        let contDays = 1;
        let contDaysEnd = daysDiff;
        let deleteFromIndex = -1;
        let deleteToIndex = -6;
        let blockIndexToEdit: number;

        if (daysDiff < 0) {
          contDays = daysDiff;
          contDaysEnd = -1;
          deleteFromIndex = 1;
          deleteToIndex = 6;
        }

        this.deleteBlocksNotInRage(
          contDays,
          contDaysEnd,
          dragToSelectEvent.start,
          dragToSelectEvent.end,
          dragToSelectEvent.id + ''
        );

        for (let weekToAddBlock = this.startSchoolYear, contWeeks = 1; weekToAddBlock < subDays(this.endSchoolYear, 7); weekToAddBlock = addDays(weekToAddBlock, 7), contWeeks++) {
          let blockIDWeek: string = dragToSelectEvent.id + '__' + (this.blockID - 1) + '__' + contWeeks;
          let startDayOnWeek: Date = addDays(dragToSelectEvent.start, contWeeks * 7);
          let endDayOnWeek: Date = addDays(dragToSelectEvent.end, contWeeks * 7);

          // Se edita el bloqueo del arreglo de bloqueos
          blockIndexToEdit = this.calendarBlocks.findIndex(myBlock => myBlock.id == blockIDWeek);
          if (blockIndexToEdit != -1) {
            this.calendarBlocks[blockIndexToEdit].startHour = startDayOnWeek;
            this.calendarBlocks[blockIndexToEdit].endHour = endDayOnWeek;
          }

          // Se edita el bloqueo del horario actual
          blockIndexToEdit = this.classes.findIndex(myBlock => myBlock.id == blockIDWeek);
          if (blockIndexToEdit != -1) {
            this.classes[blockIndexToEdit].start = startDayOnWeek;
            this.classes[blockIndexToEdit].end = endDayOnWeek;
          }

          //this.createBlockCalendarEvent(startDayOnWeek, endDayOnWeek, blockIDWeek, 'Bloqueo ' + this.blockID);
        }

        for (; contDays <= contDaysEnd; contDays++) {
          let blockID: string = dragToSelectEvent.id + '__' + contDays;
          let startDay: Date = addDays(dragToSelectEvent.start, contDays);
          let endDay: Date = addDays(dragToSelectEvent.end, contDays);

          if (!this.calendarBlocks.some(myBlock => myBlock.id == blockID) &&
            startDay > startOfView && startDay < endOfView &&
            endDay > startOfView && endDay < endOfView) {

            for (let weekToAddBlock = this.startSchoolYear, contWeeks = 1; weekToAddBlock < subDays(this.endSchoolYear, 7); weekToAddBlock = addDays(weekToAddBlock, 7), contWeeks++) {
              let blockIDWeek: string = blockID + '__' + contWeeks;
              let startDayOnWeek: Date = addDays(startDay, contWeeks * 7);
              let endDayOnWeek: Date = addDays(endDay, contWeeks * 7);

              this.createBlockCalendarEvent(startDayOnWeek, endDayOnWeek, blockIDWeek, 'Bloqueo ' + (this.blockID - 1));
            }

            // for (let weekToAddBlock = this.startSchoolYear, contWeeks = 0; weekToAddBlock < this.endSchoolYear; weekToAddBlock = addDays(weekToAddBlock, 7, contWeeks++)) {
            //   let blockIDWeek: string = blockID + '__' + contWeeks;
            //   let startDayOnWeek: Date = addDays(dragToSelectEvent.start, contDays);
            //   let endDay: Date = addDays(dragToSelectEvent.end, contDays);
            // }

            this.createBlockCalendarEvent(startDay, endDay, blockID, 'Bloqueo ' + (this.blockID - 1));

          } else {
            // Se edita el bloqueo del arreglo de bloqueos
            blockIndexToEdit = this.calendarBlocks.findIndex(myBlock => myBlock.id == blockID);
            if (blockIndexToEdit != -1) {
              this.calendarBlocks[blockIndexToEdit].startHour = startDay;
              this.calendarBlocks[blockIndexToEdit].endHour = endDay;
            }

            // Se edita el bloqueo del horario actual
            blockIndexToEdit = this.classes.findIndex(myBlock => myBlock.id == blockID);
            if (blockIndexToEdit != -1) {
              this.classes[blockIndexToEdit].start = startDay;
              this.classes[blockIndexToEdit].end = endDay;
            }

            for (let weekToAddBlock = this.startSchoolYear, contWeeks = 1; weekToAddBlock < subDays(this.endSchoolYear, 7); weekToAddBlock = addDays(weekToAddBlock, 7), contWeeks++) {
              let blockIDWeek: string = blockID + '__' + contWeeks;
              let startDayOnWeek: Date = addDays(startDay, contWeeks * 7);
              let endDayOnWeek: Date = addDays(endDay, contWeeks * 7);

              blockIndexToEdit = this.calendarBlocks.findIndex(myBlock => myBlock.id == blockIDWeek);
              if (blockIndexToEdit != -1) {
                this.calendarBlocks[blockIndexToEdit].startHour = startDayOnWeek;
                this.calendarBlocks[blockIndexToEdit].endHour = endDayOnWeek;
              }

              // Se edita el bloqueo del horario actual
              blockIndexToEdit = this.classes.findIndex(myBlock => myBlock.id == blockIDWeek);
              if (blockIndexToEdit != -1) {
                this.classes[blockIndexToEdit].start = startDayOnWeek;
                this.classes[blockIndexToEdit].end = endDayOnWeek;
              }
            }
          }
        }

        blockIndexToEdit = this.calendarBlocks.findIndex(myBlock => myBlock.id == dragToSelectEvent.id);
        this.calendarBlocks[blockIndexToEdit].endHour = dragToSelectEvent.end;

        this.refreshCal();
      });
  }

  private createBlockCalendarEvent(startDate: Date, endDate: Date, blockIdentifier: string, blockTitle: string) {
    let newBlock: CalendarEvent = {
      start: startDate,
      end: endDate,
      color: colors.red,
      title: blockTitle,
      id: blockIdentifier,
      actions: this.actions,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      meta: {
        tmpEvent: false
      }
    };

    this.classes = [...this.classes, newBlock];
    console.log(newBlock.id);

    this.calendarBlocks.push(
      new CalendarBlock(
        newBlock.id + '',
        newBlock.start,
        newBlock.end
      )
    );

    return newBlock;
  }

  private refreshCal() {
    this.classes = [...this.classes];
    this.changeDetectorRef.detectChanges();
  }

  private deleteBlocksNotInRage(fromDay: number, toDay: number, fromDate: Date, toDate: Date, blockID: string) {
    const startOfView = startOfWeek(this.viewDate);
    const endOfView = endOfWeek(this.viewDate);
    let startDay: Date;
    let endDay: Date;

    for (let contDays = -6; contDays <= 6; contDays++) {
      let blockIDToDelete: string = blockID + '__' + contDays;
      startDay = addDays(fromDate, contDays);
      endDay = addDays(toDate, contDays);

      if ((contDays < fromDay || contDays > toDay) && contDays != 0 &&
        startDay > startOfView && startDay < endOfView &&
        endDay > startOfView && endDay < endOfView) {
        let blockIndexToDelete: number;

        blockIndexToDelete = this.calendarBlocks.findIndex(myBlock => myBlock.id == blockIDToDelete);
        // console.log('CALENDAR ' + blockIndexToDelete);
        if (blockIndexToDelete != -1) {
          this.calendarBlocks.splice(blockIndexToDelete, 1);
        }

        blockIndexToDelete = this.classes.findIndex(myBlock => myBlock.id == blockIDToDelete);
        // console.log('CLASS ' + blockIndexToDelete);
        if (blockIndexToDelete != -1) {
          this.classes.splice(blockIndexToDelete, 1);
        }
      }
    }
  }

  private eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
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
    if (!word) {
      return word;
    }

    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}
