import { Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Md5} from 'md5-typescript';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-registr',
  templateUrl: './registr.component.html',
  styleUrls: ['./registr.component.css']
})
export class RegistrComponent implements OnInit {
  roles: string[] = [];
  signUp: FormGroup;
  visibleRole: boolean;

  constructor(private httpService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signUp = new FormGroup({
      login: new FormControl('', [
        Validators.required]),
      name: new FormControl('', [
        Validators.required]),
      lastName: new FormControl('', [
        Validators.required
      ]),
      midleName: new FormControl('', [
        Validators.required
      ]),
      hashPassword: new FormControl('', [
        Validators.required]),
      role: new FormControl('', [
        Validators.required])
    });
     if (this.httpService.isRole() === 'admin') {
      this.roles = ['Преподаватель', 'Редактор расписания'];
      this.visibleRole = true;
     } else {
       this.visibleRole = false;
       this.signUp.get('role').setValue('teacher');
     }
  }
  openSnackBar(msg: string) {
    this.snackBar.open(msg, 'Ok', {duration: 2000});
  }

  reg() {
   if (!this.signUp.invalid) {
     if (this.signUp.get('role').value === 'Преподаватель') {
       this.signUp.get('role').setValue('teacher');
     } else {
       this.signUp.get('role').setValue('scheduleEditor');
     }
      this.httpService.regUser(this.signUp.value).subscribe((data: any) => {
          console.log(data + ' v');
          this.signUp.get('login').setValue(null);
          this.signUp.get('name').setValue('');
          this.signUp.get('lastName').setValue('');
          this.signUp.get('midleName').setValue('');
          this.signUp.get('hashPassword').setValue('');
          this.openSnackBar(data);
        },
        (response: HttpErrorResponse) => {
        console.log(response);
          if (response.error !== undefined) {this.setErrors(response.error); }
        });
    }
  }

  setErrors(error: Errors) {
    Object.keys(error).forEach(field => {
      this.signUp.get(field).setErrors(error[field]);
    });
  }


}

interface Errors {
  login: string[];
  hashpassword: string[];
}
