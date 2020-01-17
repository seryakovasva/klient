import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PairService} from '../pair.service';
import {Time} from '../../Time';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'app-origin',
  templateUrl: './origin.component.html',
  styleUrls: ['./origin.component.css'],
  providers: [PairService]
})
export class OriginComponent implements OnInit {

  t: Time;
  groups = false;
  teachers = false;
  raspTeacher = false;
  raspAdmin = false;
  catalogsSelectionList: CatalogLink[];

  constructor(private router: Router,
              private httpService: PairService,
              private  auth: AuthService) {
    this.catalogsSelectionList = [
      {
        name : 'Группа',
        link : 'groups',
      }, {
        name : 'Преподаватель',
        link : 'teachers',
      }
    ];
  }

  ngOnInit() {
    this.httpService.getWeek(null, null, null).subscribe((data: Time) => {
        this.t = data;
      },
      error1 => console.log(error1));
  }

  logOut() {
    localStorage.removeItem('token');
  }
}

export interface CatalogLink {
  name: string;
  link: string;
  // index: number;
}
