import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Subject } from '../../../shared/model/Subject';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ReadJsonFileService } from 'src/app/shared/read-json-file/read-json-file.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent implements OnInit {

  @Input() private conflict: boolean;
  @Input() private altTitle: String;
  @Input() private classes: Subject[];
  @Output() removeSubject = new EventEmitter<string>();
  constructor(private readJSONFileService: ReadJsonFileService) { }

  ngOnInit() {
  }

  private removeClass(id){
    this.removeSubject.next(id);
  } 
  
    private titleCaseWord(word: string) {
    if (!word) {
      return word;
    }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  private enrollClasses() {
    let classCodes = this.classes.map(({ numeroClase }) => numeroClase);
    let enrollJson = {
      "cicloLectivo": {
        "codigo": this.getActualYearCicle() + ""
      },
      "clasesInscripcion": []
    }
    classCodes.forEach(code => enrollJson.clasesInscripcion.push(
      {
        "clase": {
          "codigo": "" + code
        },
      }
    ));

    let user_token = null;
    let response = {
      "enrolled": [],
      "failure": []
    };
    this.readJSONFileService.enrollClasses(enrollJson).subscribe(
      recieved_token => {
        user_token = recieved_token.token;
      },
      error => { },
      () => {
        this.readJSONFileService.enrollClassesService(enrollJson, user_token).subscribe(
          answer => {
            answer.clasesInscripcionEstudiante.forEach((mclass) => {
              if (mclass.estado == "OK") {
                response["enrolled"].push(mclass);
              } else {
                response["failure"].push(mclass);
              }
            });
          },
          error => {

          },
          () => {
            this.printEnrollResults(response);
          }
        );
      }
    )
  }
    
  private printEnrollResults(response){
    let okClasses ="Se inscribieron correctamente: \n";
    let failureClasses = "Fallo la inscripción de: \n";
    response.enrolled.forEach(mClass => {
      if(this.classes.find(subject => subject.numeroClase == mClass.clase.codigo) != undefined){
        okClasses +=(this.classes.find(subject => subject.numeroClase == mClass.clase.codigo)).nombre + "\n";
      }
    });
    response.failure.forEach(mClass => {
      if(this.classes.find(subject => subject.numeroClase == mClass.clase.codigo) != undefined){
        failureClasses +=(this.classes.find(subject => subject.numeroClase == mClass.clase.codigo)).nombre + "\n";
      }
    });
    okClasses += "\n";
    if(okClasses =="Se inscribieron correctamente: \n\n"){
      okClasses = "";
    }else if (failureClasses == "Fallo la inscripción de: \n"){
      failureClasses = "";
    }
    alert(okClasses + failureClasses);

  }


  private getActualYearCicle() {
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

    return fullYear + '-' + actualCycle
  }

}
