import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MatSelect} from '@angular/material';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../../../auth/auth.service';
import {Search} from '../../../Search';
import {PairService} from '../../pair.service';
import {requiredAngularVersionRange} from '@angular/material/typings/schematics/ng-add/version-names';
import {requireProjectModule} from '@angular/cli/utilities/require-project-module';

@Component({
  selector: 'app-add-konsult',
  templateUrl: './add-konsult.component.html',
  styleUrls: ['./add-konsult.component.css']
})
export class AddKonsultComponent implements OnInit {

  constructor(private httpService: PairService,
              public dialogRef: MatDialogRef<AddKonsultComponent>,
              private auth: AuthService,
              public router: Router) { }

  form: FormGroup;
  serErorros: boolean;
  msgErr: String;
  onBtn: boolean;

  disciplines: string[] = [];//названия дисциплин
  numberP: number[] = []; //номера пар
  rooms: string[] = []; //аудитории
  s: Search[];//переменная для получения значений для фильтров

  groupName: string[] = [];
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

  @ViewChild('singleSelect1') singleSelect1: MatSelect;
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** объект использ. при удалении */
  protected _onDestroy = new Subject<void>();

  ngOnInit() {
    this.onBtn = true;
    this.gr = true;
    this.form = new FormGroup({
      name: new FormControl(null , [Validators.required]),
      discipline: new FormControl(null , [Validators.required]),
      number: new FormControl({value: null , disable: true}, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      typePair: new FormControl([Validators.required]),
      room: new FormControl(null, [Validators.required]),
      teacher: new FormControl(null, [Validators.required])
    });;
      this.form.controls['discipline'].disable();
      this.form.controls['number'].disable();
    // this.httpService.getData('main/getSearchSelect').subscribe((data: Search[]) => {
    this.httpService.getParam(null, null).subscribe((data: Search[]) => {
          this.s = data;
          for (const all of this.s) {
            if (this.groupName.indexOf(all.nameGroup) === -1) {
              this.groupName.push(all.nameGroup);
            }
            if ((this.allTeachers.indexOf(all.teacher) === -1) && (all.teacher !== '')) {
              this.allTeachers.push(all.teacher);
            }
            if (this.rooms.indexOf(all.room) === -1) {
              this.rooms.push(all.room);
            }
          }
          this.disciplines.sort();
          this.groupName.sort();
          this.rooms.sort();
          this.allTeachers.sort();
          // загрузка списка
          this.filteredGroups.next(this.groupName.slice());

          // ???прослушка изменений поля поиска
          this.groupFilderCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterGroups();
            });

          // загрузка списка
          this.filteredTeacher.next(this.allTeachers.slice());

          // ???прослушка изменений поля поиска
          this.teacherFilderCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterTeachers();
            });
        },
        error => console.log(error));
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();

  }

  protected filterTeachers() {
    if (!this.allTeachers) {
      return;
    }
    // получение слова для поиска
    let search = this.teacherFilderCtrl.value;
    if (!search) {
      this.filteredTeacher.next(this.allTeachers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // фильтр
    this.filteredTeacher.next(
      this.allTeachers.filter(teacher => teacher.toLowerCase().indexOf(search) > -1));
    console.log(search);
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
  //получение дисциплин определенной группы
  getDis() {
    this.getFreePair();
    if (this.form.get('name').value != null) {
      this.httpService.getDisGroup(null, this.form.get('name').value).subscribe((data: string) => {
          for (const all of data) {
            if (this.disciplines.indexOf(all) === -1) {
              this.disciplines.push(all);
            }
          }
          this.form.get('number').setValue(null);
          this.form.get('room').setValue(null);
          this.form.get('discipline').setValue(null);
          // this.onBtn = false;
          this.form.controls['discipline'].enable();
        },
        error => console.log(error));
    }
  }

  //---------получение свободных пар группы в определенный день
  getFreePair() {
      let temp = null;

      console.log(this.form.get('date').value);
      if ((this.form.get('date').value !== null) && (this.form.get('name').value != null)) {
        temp = this.form.get('date').value.format('DD.MM.YYYY');

      //---------получение свободных пар группы в определенный день
      console.log('chekData' + temp);
      this.httpService.getPair(this.form.get('name').value, temp, '').subscribe((data: any) => {
          this.numberP = data;
          this.serErorros = false;
          this.form.get('number').setValue(null);
          this.form.controls['number'].enable();
          console.log(this.numberP);
        },
        (response: HttpErrorResponse) => {
          this.msgErr = response.error;
          this.serErorros = true;
        });
    }
  }

  //добавление консультации
  add() {
    if (!this.form.invalid) {
      const temp = this.form.get('date').value.format('DD.MM.YYYY');
      this.httpService.addClass(this.form.get('teacher').value, this.form.get('name').value, this.form.get('discipline').value, this.form.get('number').value,
        temp, this.form.get('room').value).subscribe((data: any) => {
          console.log(data);
          this.dialogRef.close(data);
        },
        (response: HttpErrorResponse) => {
          this.msgErr = response.error;
          this.serErorros = true;
        });
    }
  }

  //активация кнопки
  flag() {
    if ((this.form.get('discipline').value != null) && (this.form.get('number').value != null)) {
      this.onBtn = false;
    }
  }
}

