import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {Md5} from 'md5-typescript';
import {JwtHelperService} from '@auth0/angular-jwt';
import decode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(private http: ApiService, public jwtHelper: JwtHelperService) {
  }

  regUser(user: User) {
    user.hashPassword = Md5.init(user.hashPassword);
    console.log(user.hashPassword);
    return this.http.post('auth/signUp', user);
  }

  signIn(login: string, password: string) {
    const body = {
      login: login,
      hashPassword: Md5.init(password)
    };
    return this.http.post('auth/signIn', body);
  }
  public isAuthorization(): boolean {
    const token = localStorage.getItem('token');
    return (token != null);
  }

  public isRole(): string {
    const token = localStorage.getItem('token');
    const tokenPayload = decode(token);
    return (tokenPayload.role);
  }
}

interface User {
  name: string;
  login: string;
  lastName: string;
  midleName: string;
  role: string;
  hashPassword: string;
}
