import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {map, startWith, take, takeUntil} from 'rxjs/operators';
import {MatDialog, MatDialogRef, MatSelect} from '@angular/material';
import {Search} from '../../../Search';
import {PairService} from '../../pair.service';
import {AuthService} from '../../../auth/auth.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-lession',
  templateUrl: './add-lession.component.html',
  styleUrls: ['./add-lession.component.css']
})
export class AddLessionComponent implements OnInit {

  constructor(private httpService: PairService, public dialogRef: MatDialogRef<AddLessionComponent>,
              private auth: AuthService, public router: Router) { }

  form: FormGroup;
  err: boolean;
  msgErr: String;
  next: boolean;
  onBtn: boolean;

  disciplines: string[] = [];//названия дисциплин
  rooms: string[] = [];
  s: Search[];//переменная для получения значений для фильтров

  groupName: string[] = [];
  groupCtrl = new FormControl();
  /**  выбраннаая элемент управления для фильтра */
  groupFilderCtrl = new FormControl();
  /** отфильтрованный список */
  filteredGroups: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  /** элемент управления для фильтра */
  teacherFilderCtrl = new FormControl();
  groups: string[] = []; //выбранные
  /** отфильтрованный список */
  filteredTeacher: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  allTeachers: string[] = [];
  gr: boolean;
  numberP: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; //номера пар

  @ViewChild('singleSelect1') singleSelect1: MatSelect;
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** объект использ. при удалении */
  protected _onDestroy = new Subject<void>();

  ngOnInit() {
    this.onBtn = true;
    this.gr = true;
    this.form = new FormGroup({
      name: new FormControl({ value: null , disable: true}, [Validators.required]),
      discipline: new FormControl({ value: null , disable: true}),
      number: new FormControl({ value: null , disable: true}),
      date: new FormControl({ value: null , disable: true}, [Validators.required]),
      typePair: new FormControl(),
      room: new FormControl({ value: null , disable: true}),
      teacher: new FormControl()
    });
    //this.httpService.getData('main/getSearchSelect').subscribe((data: Search[]) => {
    this.httpService.getParam(null, null).subscribe((data: Search[]) => {
          this.s = data;
          for (const all of this.s) {
            if (this.rooms.indexOf(all.room) === -1) {
              this.rooms.push(all.room);
            }
          }
          this.rooms.sort();
        },
        error => console.log(error));
    if (this.auth.isRole() === 'teacher') {
      this.form.controls['name'].enable();
      this.form.controls['date'].enable();
      this.form.controls['discipline'].disable();
      this.form.controls['number'].enable();
      this.form.controls['room'].enable();
      this.httpService.getData('changeRasp/getParamPair').subscribe((data: Search[]) => {
          this.s = data;
          for (const all of this.s) {
            if (this.groupName.indexOf(all.nameGroup) === -1) {
              this.groupName.push(all.nameGroup);
            }
          }
          this.groupName.sort();

          // загрузка списка
          this.filteredGroups.next(this.groupName.slice());

          // ???прослушка изменений поля поиска
          this.groupFilderCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterGroups();
            });
        },
        error => console.log(error));
    }
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();

  }


  /**
   * Установка начального значения после загрузки групп
   */
  protected setInitialValue() {
    this.filteredGroups
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: string, b: string) => a && b && a === b;
      });
  }

  protected filterGroups() {
    if (!this.groupName) {
      return;
    }
    // получение слова для поиска
    let search = this.groupFilderCtrl.value;
    if (!search) {
      this.filteredGroups.next(this.groupName.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // фильтр
    this.filteredGroups.next(
      this.groupName.filter(teacher => teacher.toLowerCase().indexOf(search) > -1));
  }
  // //при авторизации админа, получение списка групп
  // getGroups() {
  //   this.form.controls['name'].enable();
  //   this.form.controls['date'].enable();
  //   this.form.controls['room'].enable();
  //   this.httpService.ParamPair(this.form.get('teacher').value).subscribe((data: Search[]) => {
  //     this.s = data;
  //     for (const all of this.s) {
  //       if (this.groupName.indexOf(all.nameGroup) === -1) {
  //         this.groupName.push(all.nameGroup);
  //       }
  //     }
  //     this.disciplines.sort();
  //     this.groupName.sort();
  //       // загрузка списка
  //       this.filteredGroups.next(this.groupName.slice());
  //
  //       // ???прослушка изменений поля поиска
  //       this.groupFilderCtrl.valueChanges
  //         .pipe(takeUntil(this._onDestroy))
  //         .subscribe(() => {
  //           this.filterGroups();
  //         });
  //     },
  //     error => console.log(error));
  // }

  getDis() {
    if (this.form.get('name').value != null) {
      //---------получение дисциплин определенного препода и группы
      this.httpService.getDisGroup(this.form.get('teacher').value, this.form.get('name').value).subscribe((data: string) => {
        for (const all of data) {
          if (this.disciplines.indexOf(all) === -1) {
            this.disciplines.push(all);
            }
          }
          this.disciplines.sort();
          console.log('дисциплины преподавателя ' + data);
          this.form.get('discipline').setValue(null);
          this.form.get('number').setValue(null);
          this.onBtn = true;
          this.form.controls['discipline'].enable();
        },
        error => console.log(error));
    }
  }

  // getNumber() {
  //   if ((this.form.get('date').value != null) && (this.form.get('name').value != null)) {
  //     let temp = null;
  //     if (this.form.get('date').value != null) {
  //       temp = this.form.get('date').value.format('DD.MM.YYYY');
  //     }
  //     //---------получение свободных пар группы в определенный день
  //     console.log('chekData' + temp);
  //     this.httpService.getPair(this.form.get('name').value, temp, '').subscribe((data: any) => {
  //         this.numberP = data;
  //         this.err = false;
  //         this.next = true;
  //         this.form.controls['number'].enable();
  //         console.log(this.numberP);
  //       },
  //       (response: HttpErrorResponse) => {
  //         this.msgErr = response.error;
  //         this.err = true;
  //         this.next = false;
  //       });
  //   }
  // }

  //добавление консультации
  add() {
    console.log('add')
     const temp = this.form.get('date').value.format('DD.MM.YYYY');
      this.httpService.addClass(this.form.get('teacher').value, this.form.get('name').value, this.form.get('discipline').value, this.form.get('number').value,
  temp, this.form.get('room').value).subscribe((data: any) => {
          console.log(data);
          this.dialogRef.close(data);
        },
        (response: HttpErrorResponse) => {
          this.msgErr = response.error;
          this.err = true;
        });
    }


   //активация кнопки
  flag() {
    if ((this.form.get('discipline').value != null) && (this.form.get('number').value != null) && (this.form.get('room').value != null)) {
      this.onBtn = false;
    }
  }
}
