import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { I18nService } from '@app/i18n';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 

const log = new Logger('App');
const firebaseConfig = {
  apiKey: "AIzaSyCdDO8OFczyrV2GIINTCU0QTvTOsuU9aj4",
  authDomain: "ejercicio-angular-ba1dd.firebaseapp.com",
  projectId: "ejercicio-angular-ba1dd",
  storageBucket: "ejercicio-angular-ba1dd.appspot.com",
  messagingSenderId: "506267615175",
  appId: "1:506267615175:web:7ee4779da602964c1863e2",
  measurementId: "G-900T7DC2GH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit, OnDestroy {
  numero: number| undefined;
  respuesta: string | undefined;
  color1: string | undefined;
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
              private i18nService: I18nService) { }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');


    // Setup translations
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        switchMap(route => route.data),
        untilDestroyed(this)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }

  buscarnumero(): void {
    let cadena ='';
    if (this.numero != undefined){

      // Obtener los multiplos de 3, 5, 7
      for (let x=0; x< this.numero; x++){
        if((( x % 3 ) == 0 || ( x % 5 ) == 0 || ( x % 7 ) == 0) && (this.numero % x) == 0) {
          cadena = cadena+x+',';
        }
      }
      // Eliminar ultima coma
      cadena = cadena.substr(0, cadena.length - 1);
      // Crear Array
      const multiplos = cadena.split(",");
      // Verificar que el numero tenga multiplos
      console.log(multiplos);
      if(multiplos[0] != '' ){
        this.respuesta= cadena;
        const primernumero= Number(multiplos[0]);
        console.log(primernumero);
        //asignar el color dependiendo del menor multiplo
        if(( primernumero % 3 ) == 0){
          this.color1 = 'green';
        } else if (( primernumero % 5 ) == 0){
          this.color1 = 'red';
        } else if (( primernumero % 7 ) == 0){
          this.color1 = 'blue';
        }
        
      } else {
        this.respuesta = 'Número sin múltiplos';
        cadena = 'Número sin múltiplos';
      }
      console.log(this.respuesta);
      const d = new Date,
      mes = d.getMonth()+1,
      dia = d.getDate(), 
      hora = d.getHours(), 
      min = d.getMinutes(),
      sec = d.getSeconds();

      let dia1 = '', mes1= '', hora1= '', min1= '', sec1= '';
      if(dia < 10){
        dia1 = '0'+dia.toString();
      } else {
        dia1 = dia.toString();
      }
      if(mes < 10){
        mes1 = '0'+mes.toString();
      } else {
        mes1 = mes.toString();
      }
      if(hora < 10){
        hora1 = '0'+hora.toString();
      } else {
        hora1 = hora.toString();
      }
      if(min < 10){
        min1 = '0'+min.toString();
      } else {
        min1 = min.toString();
      }
      if(sec < 10){
        sec1 = '0'+sec.toString();
      } else {
        sec1 = sec.toString();
      }
      
      const dformat = ''+d.getFullYear()+'-'+mes1+'-'+dia1+' '+hora1+':'+min1+':'+sec1;
     
      
      // se envia a la base de datos
      try {
        const docRef =  addDoc(collection(db, "BaseAngular"), {
          NumConsultado: this.numero,
          NumRespuesta: cadena,
          FechaConsulta : dformat
        });
        console.log("Registro exitoso");
      } catch (e) {
        console.error("Error adding document: ", e);
      }

    } else {
      this.respuesta = 'Por favor coloca un número';
    }
    
  }


}
