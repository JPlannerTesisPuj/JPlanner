import { Component, OnInit } from '@angular/core';
import { ReadJsonFileService } from 'src/app/shared/read-json-file/read-json-file.service';
import { DataService } from 'src/app/shared/data.service';
import { User } from './shared/model/User';
import { Subject as SubjectRxJs } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { UseGuideComponent } from './use-guide/use-guide.component';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import Hammer from 'hammerjs';
import { AutocompleteHoraryComponent } from './autocomplete-horary/autocomplete-horary.component';
import { Subject } from './shared/model/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Welcome to Jplanner';

  private showOptions: boolean = false;
  private userToken: string;
  private userAuthenticaded: User[];
  private name: string;
  // Arreglo con los tokens de usuario
  private tokenArray = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJNb3J0eSBTbWl0aCI6ImJsYSJ9.5dNAujcmM-kYGgNwkhKV7QyLx23fI5qEKFXhY2BWleU',
    'eyJ0eXAiOiJKV1QidiQM0LCJhbGciOiJIUzI1NiJ9.eyJNMAin4b3J0eSBaCI6ImJsYSJ9.5dNA54MneukYGgNwkhKV7QyLx23fI5qEKFXhY2',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzIHDN741NiJ9.eJ0eSBTbWl0aCI6ImJsYKi40iSJ9.5dNM-kYGgNwkhKV7QyLx23fKD8ncIXhY2BWleU',   
  ];

  private dialogEventSubjectRxJs: SubjectRxJs<void> = new SubjectRxJs<void>();
  private loadEvent: SubjectRxJs<string> = new SubjectRxJs<string>();

  constructor(private readJSONFileService: ReadJsonFileService, private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.userAuthenticaded = [];
    this.generateToken();

    // Se llama al servicio para encontrar el usuario con el token generado
    this.readJSONFileService.filterToken(this.userToken).subscribe(user => {
      if (user.length == 0) {
        this.name = 'Error, not authenticaded';
      } else {
        this.userAuthenticaded = user;
        this.name = 'Bienvenido, ' + this.userAuthenticaded[0].nombre_estudiante;
        this.readJSONFileService.setUSer(this.userAuthenticaded[0]);
        // Se llama al servicio que guarda el usuario en la base de datos
        this.readJSONFileService.saveUser(this.userAuthenticaded[0].GID, this.userAuthenticaded[0].credenciales).subscribe();
        this.loadEvent.next('user');
      }
    });

    
  }


  /**
   * Genera un random index
   */
  generateToken() {
    const tokenIndex = Math.floor((Math.random() * this.tokenArray.length));
    this.userToken = this.tokenArray[tokenIndex];
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  private openCreationBlockModal() {
    this.showOptions = false;
    this.dialogEventSubjectRxJs.next();
  }

  private openUseGuide() {
    let dialogRef: any = this.dialog.open(UseGuideComponent, {
      width: '100vw',
      panelClass: 'use-guide--dialog'
    })
  }

  private openAutocompleteHorary() {
    this.loadEvent.next('auto-complete');
  }

  /**
   * Bloquea o habilita el scroll si el flotante esta desplegado
   */
  private blockScroll(should:boolean){

    let body = document.getElementsByTagName('body')[0];
    if(should){
      body.classList.add("float-open");
    }
    else{
      body.classList.remove("float-open");
    }
  }
}

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
  };
}
