import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from '../shared/model/Subject';
import { ReadJsonFileService } from '../shared/read-json-file/read-json-file.service';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDay, areRangesOverlapping, addMinutes, endOfWeek, startOfWeek, addWeeks, subWeeks, differenceInHours, differenceInWeeks } from 'date-fns';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarBlock } from '../shared/model/CalendarBlock';
import { CalendarEvent } from 'calendar-utils';
import { Subject as SubjectRXJS, fromEvent, generate, Observable } from 'rxjs';

@Component({
  selector: 'app-autocomplete-horary',
  templateUrl: './autocomplete-horary.component.html'
})
export class AutocompleteHoraryComponent implements OnInit {

  private classesSelectedUserMap: Map<string, Subject[]> = new Map<string, Subject[]>();
  private classesMap: Map<string, Subject[]> = new Map<string, Subject[]>();
  private autocompleteHorarySelectedItems = [];
  private dropdownListClasses = [];
  private dropdownSettings = {};
  private calendarBlocks: CalendarBlock[] = [];
  private classes: CalendarEvent[] = [];
  private refresh: SubjectRXJS<any> = new SubjectRXJS();
  private suggestedClassesData = [];
  private creditLimit: number = 13;

  constructor(
    private readJSONFileService: ReadJsonFileService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AutocompleteHoraryComponent>
  ) {

    this.classes = data['classes'];
    this.calendarBlocks = data['calendarBlocks'];

    //Opciones de configuración del dropdown
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: true,
      allowSearchFilter: true,
      maxHeight: '150',
      limitSelection: 4
    };
    this.autocompleteSchedule();
  }

  ngOnInit() {}

  /**
   * 
   */
  autocompleteSchedule() {
    //Con el que se alimenta la lista
    let subjects: Map<string, Subject[]> = new Map<string, Subject[]>();
    let filteredArray = new Array<Subject[]>();

    this.readJSONFileService.getSuggestedClasses(1).subscribe(allClasses => {
      allClasses.forEach(oneClass => {
        if (!subjects.has(oneClass.idCurso)) {
          let subjectArray: Subject[] = [];
          subjectArray.push(oneClass);
          subjects.set(oneClass.idCurso, subjectArray);
        } else {
          subjects.get(oneClass.idCurso).push(oneClass);
        }
      });
      subjects.forEach((value: Subject[], key: string) => {
        filteredArray.push(value);
      });
      filteredArray = this.getNotOverlappedClasses(filteredArray);
      filteredArray.forEach(subjects => {
        if (subjects.length > 0) {
          this.suggestedClassesData.push({ item_id: +subjects[0].idCurso, item_text: subjects[0].nombre });
          this.classesMap.set(subjects[0].idCurso, subjects);
        }
      });
    },
      error => {

      },
      () => {
        this.dropdownListClasses = this.suggestedClassesData;
      },

    );
  }

  /**
   * 
   * @param subjects 
   */
  private getNotOverlappedClasses(subjects: Array<Subject[]>): Array<Subject[]> {

    // Lista de clases que no se cruzan con los horarios de los bloqueos
    let notOverLappedSubjects: Array<Subject[]> = [];

    let overLapped: boolean;

    subjects.forEach(subject => {
      let classesNotOverlapped: Subject[] = [];
      
      subject.forEach(myClass => {
        overLapped = false;
        if (this.calendarBlocks != undefined) {
          this.calendarBlocks.forEach(blocking => {
            myClass.horarios.forEach(horary => {

              //En esta condición se está comprobando su el bloqueo se cruza con el horario de la clase
              if (areRangesOverlapping(blocking.startHour, blocking.endHour, horary.horaInicio, horary.horaFin) && !overLapped) {
                overLapped = true;
              }

            });
          });
        }

        if (this.classes != undefined) {
          let overLappedInSubject = new Set();
          for (let theClass of this.classes) {
            for (let horary of myClass.horarios) {
              let startHour: Date = new Date(horary.horaInicio);
              let endHour: Date = new Date(horary.horaFin);
              if (areRangesOverlapping(startHour, endHour, theClass.start, theClass.end)) {
                overLapped = true;
                break;
              }
            }
          }
        }

        if (!overLapped) {
          classesNotOverlapped.push(myClass);
        }

      });
      //Si el bloqueo no se cruza con el horario de la clase lo agrega a la lista
      if (classesNotOverlapped.length > 0) {
        notOverLappedSubjects.push(classesNotOverlapped);
      }

    });


    return notOverLappedSubjects;

  }

  /**
   * 
   * @param sum 
   * @param pick 
   * @param count 
   * @param subjects 
   * @param retArr 
   * @param maxWeight 
   */
  private knapsack(sum: number, pick: number, subjects: Subject[], retArr: Subject[], maxWeight: number): boolean {

    if (pick == subjects.length) {
      return false;
    }

    if (subjects[pick].creditos < sum) {
      let r = this.knapsack(sum - subjects[pick].creditos, pick + 1, subjects, retArr, maxWeight);

      if (!r) {
        return this.knapsack(sum, pick + 1, subjects, retArr, maxWeight);
      } else {
        return this.addRecomendedSubject(retArr, subjects[pick], maxWeight);
      }
    } else if(subjects[pick].creditos > sum) {
      return this.knapsack(sum, pick + 1, subjects, retArr, maxWeight);
    } else {
      return this.addRecomendedSubject(retArr, subjects[pick], maxWeight);
    }

  }

  /**
   * 
   * @param retArr 
   * @param subject 
   * @param maxWeight 
   */
  private addRecomendedSubject(retArr: Subject[], subject: Subject, maxWeight: number): boolean {
    if (!retArr.some(myClass => myClass.idCurso == subject.idCurso)) {
      let sum: number = 0;
      let areOverlapping: boolean = false;

      for (let index=0; index <= retArr.length; ++index) {
        if (retArr[index] != undefined) {
          sum += retArr[index].creditos;
          if (this.areSubjectsOverlapping(retArr[index], subject)) {
            areOverlapping = true;
          }
        }
      }

      if (sum + subject.creditos <= maxWeight && !areOverlapping) {
        retArr.push(subject);
        return true;
      }
    }
    return false;
  }

  /**
   * 
   * @param firstSubject 
   * @param secondSubject 
   */
  private areSubjectsOverlapping(firstSubject: Subject, secondSubject: Subject): boolean {
    firstSubject.horarios.forEach(firstHorary => {
      secondSubject.horarios.forEach(secondHorary => {
        if (areRangesOverlapping(firstHorary.horaInicio, firstHorary.horaFin, secondHorary.horaInicio, secondHorary.horaFin)) {
          return true;
        }
      });
    });
    return false;
  }

  private autocompleteHorary(){
    let subjectArray: Subject[] = [];
    let recomendedSubjects: Subject[] = [];

    this.autocompleteHorarySelectedItems.forEach(myClass =>{
      this.classesSelectedUserMap.set(myClass.item_id, this.classesMap.get(myClass.item_id));
      subjectArray = subjectArray.concat(this.classesMap.get(myClass.item_id));
    });

    this.knapsack(this.creditLimit, 0, subjectArray, recomendedSubjects, this.creditLimit);
    
    this.dialogRef.close(recomendedSubjects);
  }

}
