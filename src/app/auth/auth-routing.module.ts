import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { LoginComponent } from './login.component';
import { AppComponent } from '@app/app.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: marker('Registro') } },
  { path: 'home', component: AppComponent, data: { title: marker('Inicio') } },
  { path: '', component: AppComponent, data: { title: marker('Inicio') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AuthRoutingModule { }
