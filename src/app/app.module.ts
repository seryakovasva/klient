import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {SystemModule} from './system/system.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatButtonModule, MatNativeDateModule,

} from '@angular/material';
import {ApiService} from './api.service';
import {AuthService} from './auth/auth.service';
import {JwtModule} from '@auth0/angular-jwt';
import {AuthGuardService} from './auth/auth-guard.service';
import {RoleGuardService} from './auth/role-guard.service';
import {PairService} from './system/pair.service';
import {RouterModule} from '@angular/router';
import {routes} from './app-routing.module';
import {CommonModule} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MY_FORMATS} from './system/table/table.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './core/component/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,

    FormsModule,
    HttpClientModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return localStorage.getItem('token');
        }
      }
    })
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuardService,
    RoleGuardService,
    PairService,
    {provide: LOCALE_ID, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ],
  exports: [
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
