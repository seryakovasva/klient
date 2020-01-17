import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Pair} from '../../Pair';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatDialog, MatSelect, MatSnackBar} from '@angular/material';
import {Time} from '../../Time';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {map, startWith, take, takeUntil} from 'rxjs/operators';
import {Search} from '../../Search';
import {PairService} from '../pair.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {DialogRaspComponent} from './dialog-rasp/dialog-rasp.component';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {AddLessionComponent} from '../create-rasp/add-lession/add-lession.component';
import {AddKonsultComponent} from './add-konsult/add-konsult.component';
import {AddPairComponent} from './add-pair/add-pair.component';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import {ChoiseSemesterDialogComponent} from './choise-semester-dialog/choise-semester-dialog.component';
import {AddInfofGroupsComponent} from './add-infof-groups/add-infof-groups.component';
import {saveAs} from 'file-saver';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

const URL = "http://localhost:8080/webservice-1.0-SNAPSHOT/main/inputFile";


@Component({
  selector: 'app-edit-rasp',
  templateUrl: './edit-rasp.component.html',
  styleUrls: ['./edit-rasp.component.css']
})
export class EditRaspComponent implements OnInit {

  @ViewChild('groupInput')
  groupInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoG')
  matAutocomplete: MatAutocomplete;
  @ViewChild('trigger')
  autoTrigger: MatAutocompleteTrigger;
  dataSource: MatTableDataSource<Pair>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() time: Time;//данные выбранной недели

  @Input() upday: Date;
  onWeek: boolean;

  @ViewChild('singleSelect') singleSelect: MatSelect;

  teacherCtrl = new FormControl();
  /** элемент управления для фильтра */
  teacherFilderCtrl = new FormControl();
  groups: string[] = []; //выбранные
  /** отфильтрованный список */
  filteredTeacher: ReplaySubject<string[]> = new ReplaySubject<string[]>(1)

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /**выбранная группа */
  groupCtrl = new FormControl();
  @ViewChild('multiSelect') multiSelect: MatSelect;
  /**  выбраннаая элемент управления для фильтра */
  groupFilderCtrl = new FormControl();
  /** отфильтрованный список */
  filteredGroups: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  allTeachers: string[] = [];


  s: Search[];//переменная для получения значений для фильтров
  groupName: string[] = [];//список всех групп
  disciplines: string[] = [];//названия дисциплин
  rooms: string[] = []; //список кабинетов
  pairs: Pair[];//полученное расписание


  tableBool: boolean;

  columnsToDisplay = ['nameGroup', 'dayWeek', 'numberPair', 'teacher', 'subgroup', 'typepair', 'discipline', 'room', 'date', 'info'];
  expandedElement: Pair | null;

  develop: boolean;
  numberPair: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; //номера пар

  form: FormGroup;
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'file'});

  constructor(private httpService: PairService,
              private dialog: MatDialog,
              private auth: AuthService,
              private snackBar: MatSnackBar,
              public router: Router) {
  }
  ngOnInit() {
    this.tableBool = false;
    this.develop = false;
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; } ;
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('File uploaded:', item, status, response);
    };

        this.form = new FormGroup({
          teacher: new FormControl(),
          groups: new FormControl(), //выбранные группы
          disciplin: new FormControl(),
          todayIn: new FormControl(),
        });

        this.httpService.getWeek(null, null, null).subscribe((data: Time) => {
            this.time = data;
            this.onWeek = (this.time.week > 0) && (this.time.week < 19);
          },
          error1 => console.log(error1));
        if ((this.auth.isRole() === 'admin') || (this.auth.isRole() === 'scheduleEditor')) {
          //this.httpService.getData('main/getSearchSelect').subscribe((data: Search[]) => {
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
                if (this.disciplines.indexOf(all.discipline) === -1) {
                  this.disciplines.push(all.discipline);
                }
              }
              this.disciplines.sort();
              this.allTeachers.sort();
              this.groupName.sort();
              this.disciplines.sort();
              // this.groupName.sort();
              // // загрузка списка
              // this.filteredGroups = this.groupCtrl.valueChanges.pipe(
              //   startWith(null),
              //   map((group: string | null) => group ? this._filterG(group) : this.groupName.slice()));

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
    //this.pairs. = this.paginator;
    this.dataSource = null;
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



      // //кнопка поиск
      // search() {
      //   let temp = null;
      //   if (this.form.get('todayIn').value != null) {
      //     temp = this.form.get('todayIn').value.format('DD.MM.YYYY');
      //   }
      //
      //   this.httpService.raspTeach(null, this.form.get('groups').value, this.form.get('disciplin').value, temp, this.t.monday
      //     .toString())
      //     .subscribe((data: Pair[]) => {
      //       this.pairs = data;
      //       if (this.form.get('todayIn').value != null) {
      //         this.httpService.getWeek(null, null, temp).subscribe((data: Time) => {
      //             this.t = data;
      //             console.log(this.t);
      //             if ((this.t.week > 0) && (this.t.week < 18)) {
      //               this.onWeek = true;
      //             } else {
      //               this.onWeek = false;
      //             }
      //           },
      //           error1 => console.log(error1));
      //       }
      //     },
      //     error => console.log(error));
      // }

//кнопка след неделя
      nextWeek() {
        this.httpService.getWeek(this.time.week, null, this.time.monday).subscribe((data: Time) => {
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
        this.httpService.getWeek(this.time.week, this.time.sunday, null).subscribe((data: Time) => {
            this.time = data;
            this.form.get('todayIn').setValue(null);
            this.updateTable();
            this.onWeek = ((this.time.week > 0) && (this.time.week < 19));
          },
          error => console.log(error));
      }


      selecrRow(element: Pair) {
        const dialogRef = this.dialog.open(DialogRaspComponent, {
          width: '300px',
          data: element
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
            this.openSnackBar(result);
          }
          this.updateTable();
        });
      }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, 'Ok', {duration: 2000});
  }


  updateTable() {
    let temp = null;
    if (this.form.get('todayIn').value != null) {
      temp = this.form.get('todayIn').value.format('DD.MM.YYYY');
    }

        this.httpService.raspTeach(this.form.get('teacher').value, this.form.get('groups').value, this.form.get('disciplin')
          .value, temp, this.time.monday.toString())
          .subscribe((data: Pair[]) => {
              this.pairs = data;
              this.tableBool = (data.length !== 0) && (data.length !== undefined);
              if (this.tableBool) {
                this.dataSource = new MatTableDataSource(this.pairs);
                this.dataSource.paginator = this.paginator;
              } else {
                this.dataSource = new MatTableDataSource<Pair>();
                this.dataSource.paginator = null;
                this.dataSource.disconnect();
              }
              // console.log((data.length !== 0) + '' + (data.length !== undefined));
              this.develop = data.length === 0;
              if (this.form.get('todayIn').value != null) {
                this.httpService.getWeek(null, null, temp).subscribe((data: Time) => {
                    this.time = data;
                    //console.log(this.t);
                    this.onWeek = (this.time.week > 0) && (this.time.week < 18);
                  },
                  error1 => console.log(error1));
              }
            },
            error => console.log(error));
  }

  addKonsul() {
    const dialogRef = this.dialog.open(AddKonsultComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.openSnackBar(result);
        console.log(this.form.get('groups').value);
        if ((this.form.get('teacher').value !== null) || (this.form.get('groups').value[0] !== undefined)) {
          this.updateTable();
        }
      }

    });
  }
  addNewPair() {
    const dialogRef = this.dialog.open(AddPairComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.openSnackBar(result);

        this.updateTable();
      }
    });
  }
  addInfOfGroups() {
    const dialogRef = this.dialog.open(AddInfofGroupsComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.openSnackBar(result);
      }
    });
  }

  exportXls() {
    this.httpService.getFileXsl()
      .subscribe((data: Blob) => {
        saveAs(data, 'Расписание.xls');
      });
  }

  uploadSchedule() {
    const dialogRef = this.dialog.open(ChoiseSemesterDialogComponent, {
      width: '305px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.openSnackBar(result);
        this.form.get('teacher').setValue(null);
        this.form.get('groups').setValue(null);
        this.form.get('disciplin').setValue(null);
        this.form.get('todayIn').setValue(null);
        // this.httpService.getData('main/getSearchSelect').subscribe((data: Search[]) => {
        this.httpService.getParam(null, null).subscribe((data: Search[]) => {
            this.s = data;
            this.groupName = [];
            this.allTeachers = [];
            this.rooms = [];
            this.disciplines = [];
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
              if (this.disciplines.indexOf(all.discipline) === -1) {
                this.disciplines.push(all.discipline);
              }
            }
            this.disciplines.sort();
            this.allTeachers.sort();
            this.groupName.sort();
            this.disciplines.sort();
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
    });
  }

  // updateWeek() {
  //   if (this.form.get('todayIn').value != null) {
  //     this.updateTable();
  //   } else {
  //     this.httpService.getWeek(null, null, null).subscribe((data: Time) => {
  //         this.t = data;
  //         this.updateTable();
  //         if ((this.t.week > 0) || (this.t.week < 18)) {
  //           this.onWeek = true;
  //         } else {
  //           this.onWeek = false;
  //         }
  //       },
  //       error1 => console.log(error1));
  //   }
  // }

}

