import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Option} from '@angular/cli/models/command';
import {RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {PairService} from './system/pair.service';
import {AuthService} from './auth/auth.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {map} from 'rxjs/operators';

@Injectable()
export class ApiService {

  serviceIP = 'http://localhost:8080/';
  private jsonHeaders = new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'});


  constructor(private http: HttpClient,
              private router: Router) {
  }
  // get(url: string) {
  //     return this.http.get(this.serviceIP + url, {headers: this.createAuthorizationHeader()});
  // }

  getFile(url: string, paramGroup: string, paramTeacher: string) {
      const params = new HttpParams().set('group', paramGroup).set('teacher', paramTeacher);
      return this.http.get(this.serviceIP + url, {responseType: 'blob', params, headers: this.createAuthorizationHeader()});
    // }
  }

  // post(url: string, object: any): Observable<any> {
  //     if (localStorage.getItem('token') != null) {
  //       console.log('check');
  //        if (this.checkToken()) {
  //          return this.http.post(this.serviceIP + url, object, {headers: this.createAuthorizationHeader()});
  //        }
  //     }
  //    // return this.http.post(this.serviceIP + url, object, {headers: this.createAuthorizationHeader()});
  //   return this.http.post(this.serviceIP + url, object);
  // }
  post(url: string, object: any): Observable<any> {
    if (localStorage.getItem('token') != null) {
      console.log('check');
      if (this.checkToken()) {
        const options = {
          headers: this.createAuthorizationHeader(),
          body: object,
          withCredentials: true
        };
        return this.http.request('POST', this.serviceIP + url, options)
          .pipe(map((response) => {
            return this.mapResponse(url, response);
          }));
      }
    }
    const options1 = {
      headers: this.jsonHeaders,
      body: object,
      withCredentials: true
    };
    return this.http.request('POST', this.serviceIP + url, options1)
      .pipe(map((response) => {
        return this.mapResponse(url, response);
      }));
  }

  createAuthorizationHeader(): HttpHeaders {
    const header = new HttpHeaders();
    return header.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  }

  createRefreshHeader(): HttpHeaders {
    const header = new HttpHeaders();
    return header.append('Authorization', 'Bearer ' + localStorage.getItem('refreshToken'));
  }

  public get(methodName: string) {
    const url = this.serviceIP + methodName;
    console.log('calling ' + methodName);
     const options = {
       headers: this.createAuthorizationHeader(),
       withCredentials: true
     };
    return this.http.request('GET', url, options)
      .pipe(map((response) => {
        return this.mapResponse(methodName, response);
      }));
  }

  private mapResponse(methodName, response) {
    console.log(methodName + ' call result: ', response);
    return response;
  }
  checkToken(): any {
    this.get('auth/dateCheck')
      .subscribe((data: any) => {
          console.log('222');
          return true;
        },
        (response: HttpErrorResponse) => {
          if (response.status === 401) {
            this.get('auth/updateTok')
              .subscribe((data: any) => {
                  localStorage.setItem('token', data.token.substr(7));
                  localStorage.setItem('refreshToken', data.refresh);
                  console.log('333');
                  return true;
                },
                (response1: HttpErrorResponse) => {
                  console.log(response1.status);
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

  // checkToken(): any {
  //   this.get1('auth/dateCheck')
  //     .subscribe((data: any) => {
  //         console.log('222');
  //         return true;
  //       },
  //       (response: HttpErrorResponse) => {
  //         if (response.status === 401) {
  //           this.http.get(this.serviceIP + 'auth/updateTok', {headers: this.createRefreshHeader()})
  //             .subscribe((data: any) => {
  //               localStorage.setItem('token', data.token.substr(7));
  //               localStorage.setItem('refreshToken', data.refresh);
  //               console.log('333');
  //               return true;
  //             },
  //               (response1: HttpErrorResponse) => {
  //               console.log(response1.status);
  //               this.router.navigate(['/auth/login']);
  //               localStorage.removeItem('token');
  //               localStorage.removeItem('refresh');
  //               console.log('444');
  //               return false;
  //             });
  //         } else {
  //           this.router.navigate(['/auth/login']);
  //           localStorage.removeItem('token');
  //           localStorage.removeItem('refresh');
  //           console.log('555');
  //           return false;
  //         }
  //       });
  // }
}
