import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Time} from '../Time';
import {PairService} from './pair.service';
import {AuthService} from '../auth/auth.service';
import {Faculty} from '../infoOfGroup/Faculty';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  groups = false;
  teachers = false;
  catalogsSelectionList: CatalogLink[];

  constructor(private router: Router,
              private httpService: PairService,
              private  auth: AuthService) {
    if (!this.auth.isAuthorization()) {
      this.catalogsSelectionList = [
        {
          name : 'Группа',
          link : 'groups',
        }, {
          name : 'Преподаватель',
          link : 'teachers',
        }
      ];
    } else {
      if (auth.isRole() === 'teacher') {
        this.catalogsSelectionList = [
          {
            name : 'Группа',
            link : 'groups',
          }, {
            name : 'Преподаватель',
            link : 'teachers',
          }, {
            name: 'Мое расписание',
            link: 'myrasp'
          }
        ];
      } else if ((auth.isRole() === 'admin') || (auth.isRole() === 'scheduleEditor')) {
        this.catalogsSelectionList = [
          {
            name : 'Группа',
            link : 'groups',
          }, {
            name : 'Преподаватель',
            link : 'teachers',
          }, {
            name: 'Изменить расписание',
            link: 'changerasp'
          }
        ];
      }
    }
  }

  ngOnInit() {
    //test
    this.httpService.getData('main/test').subscribe((data: string) => {
        console.log(data);
      },
      error1 => console.log(error1));

  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
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
}

export interface CatalogLink {
  name: string;
  link: string;
  // index: number;
}
