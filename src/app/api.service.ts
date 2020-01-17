import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Option} from '@angular/cli/models/command';
import {RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {PairService} from './system/pair.service';
import {AuthService} from './auth/auth.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Injectable()
export class ApiService {

  serviceIP = 'http://localhost:8080/';

    constructor(private http: HttpClient,
              private router: Router) {
  }
  get(url: string) {
      return this.http.get(this.serviceIP + url, {headers: this.createAuthorizationHeader()});
  }

  getFile(url: string, paramGroup: string, paramTeacher: string) {
      const params = new HttpParams().set('group', paramGroup).set('teacher', paramTeacher);
      return this.http.get(this.serviceIP + url, {responseType: 'blob', params, headers: this.createAuthorizationHeader()});
    // }
  }

  post(url: string, object: any): Observable<any> {
      return this.http.post(this.serviceIP + url, object, {headers: this.createAuthorizationHeader()});
  }

  createAuthorizationHeader(): HttpHeaders {
    const header = new HttpHeaders();
    return header.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  }

  createRefreshHeader(): HttpHeaders {
    const header = new HttpHeaders();
    return header.append('Authorization', 'Bearer ' + localStorage.getItem('refreshToken'));
  }

  checkToken(): any {
    this.http.get(this.serviceIP + 'auth/dateCheck', {headers: this.createAuthorizationHeader()})
      .subscribe((data: any) => {
          console.log('222');
          return true;
        },
        (response: HttpErrorResponse) => {
          if (response.status === 401) {
            this.http.get(this.serviceIP + 'auth/updateTok', {headers: this.createRefreshHeader()})
              .subscribe((data: any) => {
                localStorage.setItem('token', data.token.substr(7));
                localStorage.setItem('refreshToken', data.refresh);
                console.log('333');
                return true;
              }, error1 => {
                this.router.navigate(['/auth/login']);
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                console.log('444');
                return false;
              });
          } else {
            this.router.navigate(['/auth/login']);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            console.log('555');
            return false;
          }
        });
  }
}
