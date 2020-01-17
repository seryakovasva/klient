import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {PairService} from '../../pair.service';
import {Pair} from '../../../Pair';
import {element} from 'protractor';
import {Search} from '../../../Search';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../../../auth/auth.service';

class DialogData {
}

@Component({
  selector: 'app-dialog-rasp',
  templateUrl: './dialog-rasp.component.html',
  styleUrls: ['./dialog-rasp.component.css']
})
export class DialogRaspComponent implements OnInit {

  constructor(private httpService: PairService,
              private snackBar: MatSnackBar,
              private  auth: AuthService,
              public dialogRef: MatDialogRef<DialogRaspComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Pair) {
  }

  numberP: number[] = []; //номера пар

  cancelBool: boolean;
  transferBool: boolean;
  deleteBool: boolean;
  pair: Pair;
  rooms: string[] = []; //список кабинетов

  form: FormGroup;
  serErorros: boolean;
  msgErr: String;
  next: boolean;
  transferConsent: boolean;
  onBtn: boolean;

  ngOnInit() {
    this.pair = this.data;
    this.onBtn = true;
    this.cancelBool = this.pair.info === undefined || null;
    this.deleteBool = false;
    this.transferBool = false;
    if (this.pair.info != null) {
      this.transferConsent = this.pair.info.length <= 20;
    } else {
      this.transferConsent = true;
    }
    console.log((this.cancelBool) && (!this.deleteBool));
    console.log(this.pair.info);
  }


  // deleteOn() {
  //   this.deleteBool = true;
  // }
  //008
  // deleteOff() {
  //   this.deleteBool = false;
  // }

  //удаление занятия
  deletePair() {
    this.httpService.deletePair(this.data.id_el).subscribe((data: any) => {
        console.log(data);
        this.dialogRef.close(data);
        this.cancelBool = this.pair.info === null;
        },
      error => console.log(error));
  }

//-------------Отмена пары
  cancelPair() {
    this.pair = this.data;
    this.httpService.cancelPair(this.data).subscribe((data: any) => {
        console.log(data);
        this.pair = data;
        this.deleteBool = false;
        this.cancelBool = false;
        if (data !== undefined) {
          this.openSnackBar('Занятие отменено');
        }
      },
      error => console.log(error));
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, 'Ok', {duration: 2000});
  }

//----------Восстановление пары
  recovery() {
    this.httpService.recovery(this.pair).subscribe((data: any) => {
        this.dialogRef.close(data);
      },
      error => console.log(error));
  }

//перенос занятия
  transfer() {
    this.transferBool = true;
    this.form = new FormGroup({
      todayIn: new FormControl(),
      selectNumPair: new FormControl(null, [Validators.required]),
      room: new FormControl(null, [Validators.required])
    });
    this.form.controls['selectNumPair'].disable();

    let s: Search[];//переменная для получения значений для фильтров
    //this.httpService.getData('main/getSearchSelect').subscribe((data: Search[]) => {
    this.httpService.getParam(null, null).subscribe((data: Search[]) => {
        s = data;
        for (const all of s) {
          if (this.rooms.indexOf(all.room) === -1) {
            this.rooms.push(all.room);
          }
        }
        this.rooms.sort();
      },
      (response: HttpErrorResponse) => {
        this.msgErr = response.error;
        this.serErorros = true;
      });
  }

  //проверка даты
  chekData() {
    let temp = null;
    console.log(this.form.get('selectNumPair').value);
    if (this.form.get('todayIn').value != null) {
      temp = this.form.get('todayIn').value.format('DD.MM.YYYY');
    }
    console.log('chekData' + temp);
    this.form.controls['selectNumPair'].enable();
    this.httpService.getPair(this.pair.nameGroup, temp, '').subscribe((data: any) => {
        this.numberP = data;
        this.serErorros = false;
        // this.next = true;
        console.log(this.numberP);
      },
      (response: HttpErrorResponse) => {
        this.msgErr = response.error;
        this.serErorros = true;
        this.next = false;
      });
  }

  // chek() {
  //   let temp = null;
  //   if (this.form.get('todayIn').value != null) {
  //     temp = this.form.get('todayIn').value.format('DD.MM.YYYY');
  //   }
  //   this.httpService.chek(this.pair.nameGroup, temp, this.form.get('selectNumPair').value).subscribe((pair: any) => {
  //       this.data = pair;
  //     },
  //     error => console.log(error));
  // }

  goTransfer() {
    if (this.form.get('selectNumPair').value !== null) {
      if (this.form.get('room').value !== null) {
        let temp = null;
        if (this.form.get('todayIn').value != null) {
          temp = this.form.get('todayIn').value.format('DD.MM.YYYY');
        }
        this.httpService.transfer(this.pair.teacher, this.pair.id_el, temp, this.form.get('selectNumPair').value, this.form.get('room').value)
          .subscribe((data: any) => {
              console.log(data)
              if (data !== undefined) {
                this.openSnackBar('Занятие перенесено');
              }
              this.dialogRef.close();
            },
            (response: HttpErrorResponse) => {
              this.msgErr = response.error;
              this.serErorros = true;
            });
      }
    }
  }

  flag() {
    if ((this.form.get('room').value != null) && (this.form.get('selectNumPair').value != null)) {
      this.onBtn = false;
    }
  }

}


