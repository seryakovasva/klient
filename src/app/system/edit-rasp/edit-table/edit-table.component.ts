import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Pair} from '../../../Pair';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {DialogRaspComponent} from '../dialog-rasp/dialog-rasp.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Time} from '../../../Time';
import {PairService} from '../../pair.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.css']
})
export class EditTableComponent implements OnInit {

  @Input() outPairs: Pair[];
  @Input() form: FormGroup;
  @Input() time: Time;//данные выбранной недели
  onWeek: boolean;
  dataSource: MatTableDataSource<Pair>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columnsToDisplay: string[] = ['nameGroup', 'dayWeek', 'numberPair', 'subgroup',  'typepair', 'discipline', 'room', 'teacher', 'date', 'info'];
  expandedElement: Pair | null;
  @Input() tableBool: boolean;
  develop: boolean;
  constructor(private dialog: MatDialog,
              private httpService: PairService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.outPairs);
    this.dataSource.paginator = this.paginator;
    this.tableBool = false;
    this.develop = false;
    console.log(this.tableBool);
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
          this.outPairs = data;
          this.dataSource = new MatTableDataSource(this.outPairs);
          this.dataSource.paginator = this.paginator;
          // console.log((data.length !== 0) + '' + (data.length !== undefined));
          this.tableBool = (data.length !== 0) && (data.length !== undefined);
          this.develop = data.length === 0;
          if (this.form.get('todayIn').value != null) {
            this.httpService.getWeek(null, null, temp).subscribe((dat: Time) => {
                this.time = dat;
                //console.log(this.t);
                this.onWeek = (this.time.week > 0) && (this.time.week < 18);
              },
              error1 => console.log(error1));
          }
        },
        error => console.log(error));
  }

}
