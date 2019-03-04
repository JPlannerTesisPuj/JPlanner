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

  private userToken: string;
  private userAuthenticaded: User[];
  private name: string;
  // Arreglo con los tokens de usuario
  private tokenArray = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJNb3J0eSBTbWl0aCI6ImJsYSJ9.5dNAujcmM-kYGgNwkhKV7QyLx23fI5qEKFXhY2BWleU',
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
    const tokenIndex = 0;
    this.userToken = this.tokenArray[tokenIndex];
  }
}

