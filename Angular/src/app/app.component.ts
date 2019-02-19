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
  // Arreglo con los tokens de usuarios: primeros 6 son verdaderos, 7 al 12 no lo son
  private tokenArray = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJKdWFuIEZlbGlwZSBIZXJuYW5kZXoiOiJibGEifQ.gpoUucL8_m7DSG_9IOjKAtfRfi3tX1ISyq5Ex46Muwg',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJQZWRybyBQaWNhcGllZHJhIjoiYmxhIn0.1m7Y2NmKMsUN5JUdMOmrlyQeaGyEp0JZTy8k5vWnztI',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJSaWNrIFNhbmNoZXoiOiJibGEifQ.UiruumcHWW6QXwGVd91EJwTUUQD3qTll8c4AgvHkCG4',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJNb3J0eSBTbWl0aCI6ImJsYSJ9.5dNAujcmM-kYGgNwkhKV7QyLx23fI5qEKFXhY2BWleU',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJOaWNvbGFzIFBpbmVkYSI6ImJsYSJ9.C6Y_EL81qbpnd7kDbQJWwATPSTBVqBotmbpn6cm8rtg',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJNb25pY2EgUGFsYWNpb3MiOiJibGEifQ.4NIYC57BMDulDqzw8CcxzFOUUc1oNvlEoW2ugBK5df8',
    'hdfsdfasdsaopsmcvioreunlkcdsiofjsdiocmkdsnvdojiosacas.dsjskdvhjdskcsdfoefdsod',
    'saudjcdoivn9efew734832hjkdsh89f32ewc.7423hdsc2398rdhcssvsdf4r32984ndf923.JDIFSudfjkd328rhfdsfsdf23orfd',
    'hfsdiofoidscdsdjfisd.dgjvdkvddfwe.dfwdfcfbtrnhntyrewwewqqhbjckdiemmmdjhqdbndscs.porlsaodqiwrgnvdfcsd.12432rfdcx234',
    'truoirewvncxfowqerfjvcxln.epiuroewirpnvs932fdsf.324gtrhgdsdsd234.32t43fdsqsd234t3fds.efews',
    '374903240932jdskcsdcdslkjsdl29348fdfds.ewrfwjdkfhdsk3204urfsdjvklsd234rfds.ewfwer324dsfdw',
    'dsjvkcm.podvmihuiyrewiundskjhdias2390483290gnfvcjhke89753290jds90uc023r.fjviefdnkjsdncewry2893478392jfdfs'
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
      }
    });
  }

  /**
   * Genera un random index entre 0 y 11 y asigna a userToken el token en dicho index del token array
   */
  generateToken() {
    const tokenIndex = Math.floor((Math.random() * 11) + 1);
    this.userToken = this.tokenArray[tokenIndex];
  }
}

