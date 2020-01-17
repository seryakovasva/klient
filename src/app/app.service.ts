import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import { map} from 'rxjs/operators';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {
  }

  serviceIP = 'http://localhost:8080/webservice-1.0-SNAPSHOT/';


  getWeek(week: number, sun: Date, mon: Date) {
    const reqBody = {
      week: week,
      sunday: sun,
      monday: mon
    };
    return this.http.post(this.serviceIP + 'main/getToWeek', reqBody);
  }

  getData(query: string) {
    return this.http.get(this.serviceIP + 'main/' + query);
  }
  getStartSem(query: string) {
    return this.http.get(this.serviceIP + 'main/' + query);
  }

  getMonWeek(dateMon: Date) {
    console.log(dateMon);
    if (dateMon === null) {
      const reqBody = {
        date: dateMon
      };
      return this.http.post(this.serviceIP + 'main/getMonWeek', reqBody );
    } else {
      const reqBody = {
        date: dateMon.toDateString()
      };
      return this.http.post(this.serviceIP + 'main/getMonWeek', reqBody );
    }
  }

  TableWeek(startWeek: string) {
    const reqBody = {
      monday: startWeek
    };
    return this.http.post(this.serviceIP + 'main/table_week',  reqBody);
  }

  getRaspGroup(group_name: string[], date: string) {
    console.log(group_name);
    const reqBody = {
      nameG: group_name,
      monday: date
    };
    return this.http.post(this.serviceIP + 'main/raspGroup' , reqBody);
  }
  getSearch(group_name: string[], teachers: string[], dis: string, para: number,  room: string, date: Date, monday: string) {
    const reqBody = {
      name: group_name,
      Teachers: teachers,
      discipline: dis,
      numberPar: para,
      room: room,
      date: date,
      monday: monday
    };
    return this.http.post(this.serviceIP + 'main/search' , reqBody);
  }
  getDate(date: Date) {
    const  reqBody = {
      date: date
    };
    return this.http.post(this.serviceIP + 'main/searchDate' , reqBody);
  }
  getSearchTest(group_name: string) {
    const reqBody = {
      name: group_name
    };
    return this.http.post(this.serviceIP + 'main/searchTest' , reqBody);
  }

  regUser(user: any) {
    return this.http.post(this.serviceIP + 'auth/signUp' , user);
  }

}
