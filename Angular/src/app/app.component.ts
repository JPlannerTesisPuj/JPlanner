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
  private continue: boolean;
  private numberOfAlternatives = 6;
  private classesToShowAlternatives: Array<Materia[]> = new Array<Materia[]>(6);
  private blocksToShowAlternatives: Array<Bloqueo[]> = new Array<Bloqueo[]>(6);
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
    this.classesToShowAlternatives.fill([]);
    this.blocksToShowAlternatives.fill([]);
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
                
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 1
                this.readJSONFileService.retriveAlternative(1).subscribe(result =>{
                  console.log("result alternativa 1:", result);
                  result.forEach(element => {
                    this.classesToShowAlternatives[0].push(element as Materia);
                  });
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 1
                  this.readJSONFileService.retriveBlocks(1).subscribe(blocks =>{
                    blocks.forEach(element => {
                      this.blocksToShowAlternatives[0].push(element as Bloqueo );
                    });
                    
                  });
                  
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 2
                this.readJSONFileService.retriveAlternative(2).subscribe(result =>{
                  console.log("result alternativa 2:", result);
                  result.forEach(element => {
                    this.classesToShowAlternatives[1].push(element as Materia);
                  });
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 1
                  this.readJSONFileService.retriveBlocks(2).subscribe(blocks =>{
                    blocks.forEach(element => {
                      this.blocksToShowAlternatives[1].push(element as Bloqueo );
                    });
                    
                  });
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 3
                this.readJSONFileService.retriveAlternative(3).subscribe(result =>{
                  result.forEach(element => {
                    this.classesToShowAlternatives[2].push(element as Materia);
                  });
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 1
                  this.readJSONFileService.retriveBlocks(3).subscribe(blocks =>{
                    blocks.forEach(element => {
                      this.blocksToShowAlternatives[2].push(element as Bloqueo );
                    });
                    
                  });
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 4
                this.readJSONFileService.retriveAlternative(4).subscribe(result =>{
              
                  result.forEach(element => {
                    this.classesToShowAlternatives[3].push(element as Materia);
                  });
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 1
                  this.readJSONFileService.retriveBlocks(4).subscribe(blocks =>{
                    blocks.forEach(element => {
                      this.blocksToShowAlternatives[3].push(element as Bloqueo );
                    });
                    
                  });
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 5
                this.readJSONFileService.retriveAlternative(5).subscribe(result =>{
                 
                  result.forEach(element => {
                    this.classesToShowAlternatives[4].push(element as Materia);
                  });
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 1
                  this.readJSONFileService.retriveBlocks(5).subscribe(blocks =>{
                    blocks.forEach(element => {
                      this.blocksToShowAlternatives[4].push(element as Bloqueo );
                    });
                    
                  });
                  
                });
                // Se llama al servicio que consulta la bd y retorna las materias de la alternativa 6
                this.readJSONFileService.retriveAlternative(6).subscribe(result =>{
                
                  result.forEach(element => {
                    this.classesToShowAlternatives[5].push(element as Materia);
                  });
                  // Se llama al servicio que consulta la bd y retorna los bloqueos de la alternativa 1
                  this.readJSONFileService.retriveBlocks(6).subscribe(blocks =>{
                    blocks.forEach(element => {
                      this.blocksToShowAlternatives[5].push(element as Bloqueo );
                    });
                    
                  });
                  
                });
            
          }
        
        });
        this.continue = true;
        let data = {
          'alternatives' : this.classesToShowAlternatives,
          'blocks': this.blocksToShowAlternatives,
          'continue': this.continue
        };
        console.log("data: ", data);
        this.showAlternatives(data);
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

  private showAlternatives(classesToShowAlternatives: any){
    this.eventsSubject.next(classesToShowAlternatives);
  }
  private openCreationBlockModal() {
    this.showOptions = false;
    this.dialogEventSubjectRxJs.next();
  }

  
}

