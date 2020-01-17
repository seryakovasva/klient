import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatSelect} from '@angular/material';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith, take, takeUntil} from 'rxjs/operators';
import {Search} from '../../Search';
import {Pair} from '../../Pair';
import {Time} from '../../Time';
import {PairService} from '../pair.service';
import {Faculty} from '../../infoOfGroup/Faculty';
import { saveAs } from 'file-saver';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Pair>;
  panelOpenState = false; // for panel facult

  /**  выбраннаая элемент управления для фильтра */
  groupFilderCtrl = new FormControl();
  /** отфильтрованный список */
  filteredGroups: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** объект использ. при удалении */
  protected _onDestroy = new Subject<void>();

  onWeek: boolean;

  @ViewChild('multiSelectT') multiSelectT: MatSelect;
  /**  выбраннаая элемент управления для фильтра */
  teacherFilderCtrl = new FormControl();
  /** отфильтрованный список */
  filteredTeachers: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  s: Search[];

  tableBool = false; //открыть/скрыть таблицу
  pairs: Pair[];

  develop: boolean;
  @Input() time: Time;
  form: FormGroup;

  groupName: string[] = [];//список всех групп
  rooms: string[] = []; //список кабинетов
  disciplines: string[] = [];//названия дисциплин
  numberP: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; //номера пар
  allTeachers: string[] = [];//все преподаватели
  infOfGroups: Faculty[];
  groups: string[] = [];
  constructor(private httpService: PairService) {

  }

  ngOnInit() {
    // console.log('kykys');
    this.form = new FormGroup({
      nameGr: new FormControl(  null),
      discipline: new FormControl(  null),
      numberPair: new FormControl(   null),
      date: new FormControl(  null ),
      typePair: new FormControl(  null ),
      room: new FormControl( null),
      teacher: new FormControl(  null )
    });
    // this.onWeek = (this.time.week > 0) && (this.time.week < 19);
    this.httpService.getWeek(null, null, null).subscribe((data: Time) => {
      this.time = data;
      console.log(this.time);
        this.onWeek = (this.time.week > 0) && (this.time.week < 19);
    },
      error1 => console.log(error1));

    this.httpService.getData('main/getInfofGroups').subscribe((data: Faculty[]) => {
        this.infOfGroups = data;
      },
      error1 => console.log(error1));


    //this.httpService.getData('main/getSearchSelect').subscribe((data: Search[]) => {
    this.httpService.getParam(null, null).subscribe((data: Search[]) => {
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

  ngAfterViewInit() {
    this.setInitialValue();
    this.setInitialValueT();
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

  protected setInitialValueT() {
    this.filteredTeachers
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelectT.compareWith = (a: string, b: string) => a && b && a === b;
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

  search( ) {
    if ((this.form.get('nameGr').value === null) && (this.form.get('teacher').value === null) && (this.form.get('discipline').value === null)
      && (this.form.get('numberPair').value === null) && (this.form.get('room').value === null) && (this.form.get('date').value === null)) {
      this.tableBool = false;
    } else {
      this.tableBool = this.form.get('nameGr').value !== null;
      let temp = null;
      if (this.form.get('date').value != null) {
        temp = this.form.get('date').value.format('DD.MM.YYYY');
      }
      this.groups[0] = this.form.get('nameGr').value;
      this.httpService.getSearch( this.groups,  this.form.get('teacher').value,
        this.form.get('discipline').value, this.form.get('numberPair').value, this.form.get('room').value, temp,
        this.time.monday.toString())
        .subscribe((data: Pair[]) => {
          console.log(data.length);
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
      },
      error => console.log(error));
  }

  exportPdf() {
    this.httpService.getFilePdf(this.form.get('nameGr').value, null)
      .subscribe((data: Blob) => {

        saveAs(data, 'Расписание.pdf');
      });
  }

  selectedGroup(group: string) {
    this.onWeek = (this.time.week > 0) && (this.time.week < 19);
    if (group !== this.form.get('nameGr').value) {
      this.form.get('nameGr').setValue(group);
      this.form.get('teacher').setValue(null);
      this.form.get('discipline').setValue(null);
      this.form.get('numberPair').setValue(null);
      this.form.get('room').setValue(null);
      this.form.get('date').setValue(null);
    }
    this.form.get('nameGr').setValue(group);
    this.form.get('teacher').setValue(null);
    this.form.get('discipline').setValue(null);
    this.form.get('numberPair').setValue(null);
    this.form.get('room').setValue(null);
    this.tableBool = true;
    this.allTeachers = [];
    this.disciplines = [];
    this.rooms = [];
    this.form.get('numberPair').setValue(null);
    this.form.get('date').setValue(null);
    //получение параметров для выбранной группы
    this.httpService.getParam(null, this.form.get('nameGr').value)
      .subscribe((data: Search[]) => {
          this.s = data;
          for (const all of this.s) {
            if ((this.allTeachers.indexOf(all.teacher) === -1) && (all.teacher !== '')) {
              this.allTeachers.push(all.teacher);
            }
            if (this.rooms.indexOf(all.room) === -1) {
              this.rooms.push(all.room);
            }
            if (this.disciplines.indexOf(all.discipline) === -1) {
              this.disciplines.push(all.discipline);
            }
          }
          this.rooms.sort();
          this.allTeachers.sort();
          this.disciplines.sort();
            // загрузка списка
            this.filteredTeachers.next(this.allTeachers.slice());

            // ???прослушка изменений поля поиска
            this.teacherFilderCtrl.valueChanges
              .pipe(takeUntil(this._onDestroy))
              .subscribe(() => {
                this.filterTeachers();
              });
        },
        error => console.log(error));
    this.search();
  }

  protected filterTeachers() {
    if (!this.allTeachers) {
      return;
    }
    // получение слова для поиска
    let search = this.teacherFilderCtrl.value;
    if (!search) {
      this.filteredTeachers.next(this.allTeachers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // фильтр
    this.filteredTeachers.next(
      this.allTeachers.filter(teacher => teacher.toLowerCase().indexOf(search) > -1));
  }

}


