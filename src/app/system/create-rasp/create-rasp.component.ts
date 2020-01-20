import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Pair} from '../../Pair';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatDialog, MatSelect, MatSnackBar} from '@angular/material';
import {Time} from '../../Time';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {map, startWith, take, takeUntil} from 'rxjs/operators';
import {Search} from '../../Search';
import {PairService} from '../pair.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {DialogRaspComponent} from '../edit-rasp/dialog-rasp/dialog-rasp.component';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {AddLessionComponent} from './add-lession/add-lession.component';
import {saveAs} from 'file-saver';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-create-rasp',
  templateUrl: './create-rasp.component.html',
  styleUrls: ['./create-rasp.component.css'],
})
export class CreateRaspComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('groupInput')
  groupInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoG')
  matAutocomplete: MatAutocomplete;
  @ViewChild('trigger')
  autoTrigger: MatAutocompleteTrigger;
  @ViewChild('multiSelect') multiSelect: MatSelect;

  @Input() time: Time; // данные выбранной недели
  @Input() upday: Date;
  onWeek: boolean;

  /**  выбраннаая элемент управления для фильтра */
  groupFilderCtrl = new FormControl();
  /** отфильтрованный список */
  filteredGroups: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  protected _onDestroy = new Subject<void>();

  tableBool: boolean;

  s: Search[]; // переменная для получения значений для фильтров
  groupName: string[] = []; // список всех групп
  disciplines: string[] = []; // названия дисциплин
  rooms: string[] = []; // список кабинетов

  pairs: Pair[]; // полученное расписание
  develop: boolean;

  columnsToDisplay = ['dayWeek', 'numberPair', 'nameGroup', 'subgroup', 'typepair', 'discipline', 'room', 'date', 'info'];
  expandedElement: Pair | null;

  @ViewChild('singleSelect') singleSelect: MatSelect;

  numberP: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; //номера пар

  form: FormGroup;
  newDate: Date;
  myDate: number =  Date.now();
  jstoday: string;
  constructor(private httpService: PairService,
              private dialog: MatDialog,
              private auth: AuthService,
              private snackBar: MatSnackBar,
              public router: Router) {
    this.jstoday = formatDate(this.myDate, 'dd.MM.yyyy', 'en-US', '+0200');
  }

  ngOnInit() {
    this.form = new FormGroup({
      groups: new FormControl(), //выбранные группы
      disciplin: new FormControl(),
      todayIn: new FormControl(),
    });
    this.develop = false;
    // this.onWeek = (this.time.week > 0) || (this.time.week < 19);
    if (this.auth.isRole() === 'teacher') {//авторизован преподаватель
    this.httpService.getWeek(null, this.jstoday, null).subscribe((data: Time) => {
        this.time = data;
        this.onWeek = (this.time.week > 0) && (this.time.week < 19);

        this.httpService.raspTeach(null, null, null, null, this.time.monday.toString()).subscribe((data: any) => {
            this.pairs = data;
            this.develop = data.length === 0;
            this.tableBool = data.length !== 0;
          },
          error1 => this.router.navigate(['/auth/login']));
      },
      error1 => console.log(error1));


    }
    if (this.auth.isRole() === 'teacher') {
      this.httpService.getData('changeRasp/getParamPair').subscribe((data: Search[]) => {
          this.s = data;
          for (const all of this.s) {
            if (this.groupName.indexOf(all.nameGroup) === -1) {
              this.groupName.push(all.nameGroup);
            }
            if (this.disciplines.indexOf(all.discipline) === -1) {
              this.disciplines.push(all.discipline);
            }
          }
          this.disciplines.sort();
          this.groupName.sort();
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

  protected setInitialValue() {
    this.filteredGroups
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: string, b: string) => a && b && a === b;
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


//кнопка след неделя
  nextWeek() {
    this.httpService.getWeek(this.time.week, null, this.time.monday.toString()).subscribe((data: Time) => {
        this.time = data;
        this.form.get('todayIn').setValue(null);
        this.updateTable();
        this.onWeek = ((this.time.week > 0) && (this.time.week < 19));
        console.log(this.onWeek);
      },
      error => console.log(error));
  }

  //кнопка пред неделя
  backWeek() {
    this.httpService.getWeek(this.time.week, this.time.sunday.toString(), null).subscribe((data: Time) => {
        this.time = data;
        this.form.get('todayIn').setValue(null);
        this.updateTable();
        this.onWeek = ((this.time.week > 0) && (this.time.week < 19));
        console.log(this.onWeek);
      },
      error => console.log(error));
  }


  selectRow(element: Pair) {
    const dialogRef = this.dialog.open(DialogRaspComponent, {
      width: '300px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateTable();
    });
  }

  exportPdf() {
    this.httpService.getFilePdf(null, null)
      .subscribe((data: Blob) => {
        saveAs(data, 'Расписание.pdf');
      });
  }

  updateTable() {
    let temp = null;
    console.log('name' + this.form.get('groups').value);
    if (this.form.get('todayIn').value != null) {
      temp = this.form.get('todayIn').value.format('DD.MM.YYYY');
    }
      this.httpService.raspTeach(null, this.form.get('groups').value, this.form.get('disciplin').value, temp, this.time.monday.toString())
        .subscribe((data: Pair[]) => {
            this.pairs = data;
            this.develop = data.length === 0;
            this.tableBool = data.length !== 0;
            if (this.form.get('todayIn').value != null) {
              this.httpService.getWeek(null, null, temp).subscribe((data: Time) => {
                  this.time = data;
                  //console.log(this.t);
                  this.onWeek = (this.time.week > 0) && (this.time.week < 19);
                },
                error1 => console.log(error1));
            }
          },
          error => console.log(error));

  }

  addLession() {
    const dialogRef = this.dialog.open(AddLessionComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.openSnackBar(result);
      }
      console.log('The dialog was closed');
      this.updateTable();
    });
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, 'Ok', {duration: 2000});
  }
}
