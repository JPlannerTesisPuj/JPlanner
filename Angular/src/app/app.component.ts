import { Component, OnInit } from '@angular/core';
import { ReadJsonFileService } from 'src/app/shared/read-json-file/read-json-file.service';
import { DataService } from 'src/app/shared/data.service';
import { User } from './shared/model/User';
import { Materia } from './shared/model/rest/Materia';
import { Subject as SubjectRxJs } from 'rxjs';
import { Bloqueo } from './shared/model/rest/Bloqueo';

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
  private blocksToShowAlternatives: Array<Bloqueo[]> = new Array<Bloqueo[]>();
  private eventsSubject: SubjectRxJs<any> = new SubjectRxJs<any>();
  // Arreglo con los tokens de usuario
  private tokenArray = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJNb3J0eSBTbWl0aCI6ImJsYSJ9.5dNAujcmM-kYGgNwkhKV7QyLx23fI5qEKFXhY2BWleU',
    'eyJ0eXAiOiJKV1QidiQM0LCJhbGciOiJIUzI1NiJ9.eyJNMAin4b3J0eSBaCI6ImJsYSJ9.5dNA54MneukYGgNwkhKV7QyLx23fI5qEKFXhY2',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzIHDN741NiJ9.eJ0eSBTbWl0aCI6ImJsYKi40iSJ9.5dNM-kYGgNwkhKV7QyLx23fKD8ncIXhY2BWleU',   
  ];

  private dialogEventSubjectRxJs: SubjectRxJs<void> = new SubjectRxJs<void>();

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
          // Si el usuario esta en la base de datos pone en true la variable que indica si existe o no en la bd
          if (user["GID"] == this.userAuthenticaded[0].GID){
                this.continue = true;
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 1
                this.readJSONFileService.retriveAlternative(1).subscribe(result =>{
                  
                  this.classesToShowAlternatives[0] = Object.assign([], result);
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 1
                  this.readJSONFileService.retriveBlocks(1).subscribe(blocks =>{
                    this.blocksToShowAlternatives[0] = Object.assign([], blocks);
                    console.log("bloqueos", this.blocksToShowAlternatives);
                  });
                  console.log("Materias",this.classesToShowAlternatives);
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 2
                this.readJSONFileService.retriveAlternative(2).subscribe(result =>{
                  
                  this.classesToShowAlternatives[1] = Object.assign([], result); 
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 2
                  this.readJSONFileService.retriveBlocks(2).subscribe(blocks =>{
                    this.blocksToShowAlternatives[1] = Object.assign([], blocks);
  
                  });
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 3
                this.readJSONFileService.retriveAlternative(3).subscribe(result =>{
                  
                  this.classesToShowAlternatives[2] = Object.assign([], result);
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 3
                  this.readJSONFileService.retriveBlocks(3).subscribe(blocks =>{
                    this.blocksToShowAlternatives[2] = Object.assign([], blocks);
                  });
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 4
                this.readJSONFileService.retriveAlternative(4).subscribe(result =>{
              
                  this.classesToShowAlternatives[3] = Object.assign([], result);
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 4
                  this.readJSONFileService.retriveBlocks(4).subscribe(blocks =>{
                    this.blocksToShowAlternatives[3] = Object.assign([], blocks);
                  });
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 5
                this.readJSONFileService.retriveAlternative(5).subscribe(result =>{
                 
                  this.classesToShowAlternatives[4] = Object.assign([], result);
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 5
                  this.readJSONFileService.retriveBlocks(5).subscribe(blocks =>{
                    this.blocksToShowAlternatives[4] = Object.assign([], blocks);
                  });
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 6
                this.readJSONFileService.retriveAlternative(6).subscribe(result =>{
                
                  this.classesToShowAlternatives[5] = Object.assign([], result);
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 6
                  this.readJSONFileService.retriveBlocks(6).subscribe(blocks =>{
                    this.blocksToShowAlternatives[5] = Object.assign([], blocks);
                  });
                  
                });
            
          }
        
        });
      }
      this.showAlternatives();
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

  private showAlternatives(){
    this.eventsSubject.next();
  }
  private openCreationBlockModal() {
    this.showOptions = false;
    this.dialogEventSubjectRxJs.next();
  }

  
}

