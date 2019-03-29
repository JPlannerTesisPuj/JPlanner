import { Component, OnInit } from '@angular/core';
import { ReadJsonFileService } from 'src/app/shared/read-json-file/read-json-file.service';
import { DataService } from 'src/app/shared/data.service';
import { User } from './shared/model/User';
import { Materia } from './shared/model/rest/Materia';
import { Subject as SubjectRxJs } from 'rxjs';

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
  private continue: boolean = false ;
  private classesToShowAlternatives: Array<Materia[]> = new Array<Materia[]>();
  private eventsSubject: SubjectRxJs<any> = new SubjectRxJs<any>();
  // Arreglo con los tokens de usuario
  private tokenArray = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJNb3J0eSBTbWl0aCI6ImJsYSJ9.5dNAujcmM-kYGgNwkhKV7QyLx23fI5qEKFXhY2BWleU',
    'eyJ0eXAiOiJKV1QidiQM0LCJhbGciOiJIUzI1NiJ9.eyJNMAin4b3J0eSBaCI6ImJsYSJ9.5dNA54MneukYGgNwkhKV7QyLx23fI5qEKFXhY2',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzIHDN741NiJ9.eJ0eSBTbWl0aCI6ImJsYKi40iSJ9.5dNM-kYGgNwkhKV7QyLx23fKD8ncIXhY2BWleU',   
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
        // Se llama al servicio que guarda el usuario en la base de datos
        this.readJSONFileService.saveUser(this.userAuthenticaded[0].GID, this.userAuthenticaded[0].credenciales).subscribe();
        this.readJSONFileService.validateUser(this.userAuthenticaded[0].GID).subscribe(user =>{
          console.log(user["GID"]);
          if (user["GID"] == this.userAuthenticaded[0].GID){
                this.continue = true;
                this.readJSONFileService.retriveAlternative(1).subscribe(result =>{
                  
                  
                  this.classesToShowAlternatives[0] = Object.assign([], result);
                  console.log(this.classesToShowAlternatives);
                  
                });
                this.readJSONFileService.retriveAlternative(2).subscribe(result =>{
                  
                  
                  this.classesToShowAlternatives[1] = Object.assign([], result); 
                  
                });
                this.readJSONFileService.retriveAlternative(3).subscribe(result =>{
                  
                 
                  this.classesToShowAlternatives[2] = Object.assign([], result); 
                  
                });
                this.readJSONFileService.retriveAlternative(4).subscribe(result =>{
              
                  
                  this.classesToShowAlternatives[3] = Object.assign([], result); 
                  
                });
                this.readJSONFileService.retriveAlternative(5).subscribe(result =>{
                 
                  this.classesToShowAlternatives[4] = Object.assign([], result); 
                  
                });
                this.readJSONFileService.retriveAlternative(6).subscribe(result =>{
                
                
                  this.classesToShowAlternatives[5] = Object.assign([], result); 
                  
                });
            
          }
        
        });
      }
    });
  
   this.showAlternatives();
    
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

  private showAlternatives(){
    this.eventsSubject.next();
  }

  
}

