import {Component, Input, ViewChild, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Pair} from '../../Pair';
import {PairService} from '../pair.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [PairService,
    DatePipe,
    ]
})
export class TableComponent  {

  @Input() outPairs: Pair[];
  @Input() nothing: boolean;
  @Input() dataSource: MatTableDataSource<Pair>;
  @Input() @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['nameGroup', 'dayWeek', 'numberPair', 'subgroup',  'typepair', 'discipline', 'room', 'teacher', 'date', 'info'];
  expandedElement: Pair | null;

  constructor() { }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    console.log(this.outPairs.length);
  //  this.dataSource = new MatTableDataSource(this.outPairs);
   // this.dataSource.paginator = this.paginator;
  }


}
