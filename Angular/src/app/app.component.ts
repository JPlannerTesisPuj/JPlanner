import { Component, OnInit } from '@angular/core';
import { ReadJsonFileService } from 'src/app/shared/read-json-file/read-json-file.service';
import { DataService } from 'src/app/shared/data.service';
import { User } from './shared/model/User';

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
  // Arreglo con los tokens de usuarios: primeros 6 son verdaderos, 7 al 12 no lo son
  private tokenArray = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJNb3J0eSBTbWl0aCI6ImJsYSJ9.5dNAujcmM-kYGgNwkhKV7QyLx23fI5qEKFXhY2BWleU',
    'eyJ0eXAiOiJKV1QidiQM0LCJhbGciOiJIUzI1NiJ9.eyJNMAin4b3J0eSBaCI6ImJsYSJ9.5dNA54MneukYGgNwkhKV7QyLx23fI5qEKFXhY2',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzIHDN741NiJ9.eJ0eSBTbWl0aCI6ImJsYKi40iSJ9.5dNM-kYGgNwkhKV7QyLx23fKD8ncIXhY2BWleU',
    '374903240932jdskcsdcdslkjsdl29348fdfds.ewrfwjdkfhdsk3204urfsdjvklsd234rfds.ewfwer324dsfdw',
    'dsjvkcm.podvmihuiyrewiundskjhdias2390483290gnfvcjhke89753290jds90uc023r.fjviefdnkjsdncewry2893478392jfdfs',
    'jkdfjaskldjlaksjdlkasd.safajsdasdas.safasdasjfewfcsad.DFSsfsdwdasdaasfsdresfsa.sdfsdfwefsa.322sdacsdcsddcds'
  ];

  constructor(private readJSONFileService: ReadJsonFileService, private data: DataService) { }

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
      }
    });
  }

  /**
   * Genera un random index entre 0 y 5 y asigna a userToken el token en dicho index del token array
   */
  generateToken() {
    const tokenIndex = Math.floor((Math.random() * 5) + 1);
    this.userToken = this.tokenArray[tokenIndex];
  }

  
}

