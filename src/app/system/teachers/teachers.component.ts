import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {MatSelect} from '@angular/material';
import {Search} from '../../Search';
import {take, takeUntil} from 'rxjs/operators';
import {Time} from '../../Time';
import {Pair} from '../../Pair';
import {PairService} from '../pair.service';
import {saveAs} from 'file-saver';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
  providers: [PairService]
})
export class TeachersComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Pair>;
  @ViewChild('singleSelect') singleSelect: MatSelect;

  teacherFilderCtrl = new FormControl();
  groups: string[] = []; //выбранные
  /** отфильтрованный список */
  filteredTeacher: ReplaySubject<string[]> = new ReplaySubject<string[]>(1)

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  //переменные для фильтра
  groupName: string[] = [];
  s: Search[];
  allTeachers: string[] = [];
  rooms: string[] = [];
  disciplines: string[] = [];
  numberP: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; //номера пар

  @Input() time: Time;
  onWeek: boolean;
  tableBool: boolean; //открыть/скрыть таблицу
  pairs: Pair[];
  teachers: string[] = []; //выбранный преподаватель
  develop: boolean;

  nameT: string;
  form: FormGroup;
  /**выбранная группа */
  @ViewChild('multiSelect') multiSelect: MatSelect;
  /**  выбраннаая элемент управления для фильтра */
  groupFilderCtrl = new FormControl();
  /** отфильтрованный список */
  filteredGroups: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  constructor(private httpService: PairService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      nameGr: new FormControl(null),
      discipline: new FormControl(null),
      numberPair: new FormControl(null),
      date: new FormControl(null),
      typePair: new FormControl(null),
      room: new FormControl(null),
      teacher: new FormControl(null)
    });

    // this.onWeek = (this.time.week > 0) && (this.time.week < 19);
    this.httpService.getWeek(null, null, null).subscribe((data: Time) => {
        this.time = data;
        this.onWeek = (this.time.week > 0) && (this.time.week < 19);
      },
      error1 => console.log(error1));

    //this.httpService.getData('main/getSearchSelect').subscribe((data: Search[]) => {
    this.httpService.getParam(null, null).subscribe((data: Search[]) => {
        this.s = data;
        for (const all of this.s) {
          if ((this.allTeachers.indexOf(all.teacher) === -1) && (all.teacher !== '')) {
            this.allTeachers.push(all.teacher);
          }
        }
        this.allTeachers.sort();
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
    this.setInitialValueG();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    console.log('tut');
  }

  /**
   * Установка начального значения после загрузки фильтруемого банка
   */
  protected setInitialValue() {
    this.filteredTeacher
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
  protected setInitialValueG() {
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
    console.log(search);
  }

  exportPdf() {
    this.httpService.getFilePdf(null, this.form.get('teacher').value)
      .subscribe((data: Blob) => {
        saveAs(data, 'Расписание.pdf');
      });
  }

  selectedTeacher() {
    this.onWeek = (this.time.week > 0) && (this.time.week < 19);
    this.form.get('discipline').setValue(null);
    this.form.get('numberPair').setValue(null);
    this.form.get('room').setValue(null);
    this.form.get('nameGr').setValue(null);
    this.form.get('date').setValue(null);
    this.tableBool = true;
    this.groupName = [];
    this.disciplines = [];
    this.rooms = [];
    this.httpService.getInfo(this.form.get('teacher').value).subscribe((data: any) => {
        console.log(data);
        this.nameT = data;
      },
      error1 => console.log(error1));
    //получение параметров для выбранной группы
    this.httpService.getParam(this.form.get('teacher').value, null)
      .subscribe((data: Search[]) => {
          this.s = data;
          for (const all of this.s) {
            if (this.groupName.indexOf(all.nameGroup) === -1) {
              this.groupName.push(all.nameGroup);
            }
            if (this.rooms.indexOf(all.room) === -1) {
              this.rooms.push(all.room);
            }
            if (this.disciplines.indexOf(all.discipline) === -1) {
              this.disciplines.push(all.discipline);
            }
          }
          console.log(this.groupName);
          this.rooms.sort();
          this.groupName.sort();
          this.disciplines.sort();
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
    this.search();
  }

  search() {
    if ((this.form.get('nameGr').value === null) && (this.form.get('teacher').value === null) && (this.form.get('discipline').value === null)
      && (this.form.get('numberPair').value === null) && (this.form.get('room').value === null) && (this.form.get('date').value === null)) {
      this.tableBool = false;
    } else {
      this.tableBool = this.form.get('teacher').value !== null;
      let temp = null;
      if (this.form.get('date').value != null) {
        temp = this.form.get('date').value.format('DD.MM.YYYY');
      }
      this.teachers[0] = this.form.get('teacher').value;
      this.httpService.getSearch( this.form.get('nameGr').value,  this.teachers,
        this.form.get('discipline').value, this.form.get('numberPair').value, this.form.get('room').value, temp,
        this.time.monday.toString())
        .subscribe((data: Pair[]) => {
            this.pairs = data;
            this.dataSource = new MatTableDataSource(this.pairs);
            this.dataSource.paginator = this.paginator;
            this.develop = data.length !== 0;
            if (this.form.get('date').value != null) {
              this.httpService.getWeek(null, null, temp).subscribe((data: Time) => {
                  this.time = data;
                  this.onWeek = (this.time.week > 0) && (this.time.week < 19);
                },
                error1 => console.log(error1));
            }
          },
          error => console.log(error));
    }
  }

  nextWeek( ) {
    this.httpService.getWeek(this.time.week, null, this.time.monday).subscribe((data: Time) => {
        this.time = data;
        this.form.get('date').setValue(null);
        this.search();
        this.onWeek = ((this.time.week > 0) && (this.time.week < 19));
      },
      error => console.log(error));
  }

  // кнопка пред неделя
  backWeek() {
    this.httpService.getWeek(this.time.week, this.time.sunday, null).subscribe((data: Time) => {
        this.time = data;
        this.form.get('date').setValue(null);
        this.search();
        this.onWeek = ((this.time.week > 0) && (this.time.week < 19));
        console.log(this.onWeek);
      },
      error => console.log(error));
  }
}

