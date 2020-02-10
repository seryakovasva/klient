import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {RoleGuardService} from '../role-guard.service';
import {DatePipe, formatDate} from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  //dateFormat = require('dateformat');
  myDate: number =  Date.now();
  jstoday = '';
  //date = this.datePipe.transform(this.myDate, 'yyyy-MM-dd HH:mm:ss');
    constructor(private router: Router,
              private http: AuthService) {
      this.jstoday = formatDate(this.myDate, 'yyyy-MM-dd HH:mm:ss', 'en-US', '+0200');
    }

  ngOnInit() {
    //  this.dateFormat(this.myDate, 'yyyy-MM-dd HH:mm:ss');
   // this.date = this.datePipe.transform(this.myDate, 'yyyy-MM-dd HH:mm:ss');
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }


  login() {
    if (this.form.get('login').value != null) {
      if (this.form.get('password').value != null) {
      this.http.signIn(
        this.form.get('login').value,
        this.form.get('password').value
      ).subscribe(
        (data: any) => {
          console.log(data);
          localStorage.setItem('token', data.token.substr(7));
          localStorage.setItem('refreshToken', data.refreshToken);
          this.router.navigate(['/']);
        },
        (response: HttpErrorResponse) => {
          if (response.error !== undefined) {
            this.setErrors(response.error);
          }
        });
    }
  }
  }

  setErrors(error1: Errors) {
    console.log(error1);
    Object.keys(error1).forEach(field => {
      this.form.get(field).setErrors(error1[field]);
    });
  }
}
interface Errors {
  login: string[];
  password: string[];
}
