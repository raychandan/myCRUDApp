import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = environment.apiURL+'/api/user';

  constructor(private http:HttpClient) { }

  login(data: any):Observable<any> {
    return this.http.post(this.url+'/login', data, httpOptions);
  }

  register(data: any):Observable<any> {
    return this.http.post(this.url+'/register', data, httpOptions);
  }

  forgotPassword(data: any):Observable<any> {
    return this.http.post(this.url+'/forget-password', data, httpOptions);
  }

  resetPassword(data: any):Observable<any> {
    return this.http.post(this.url+'/reset-password', data, httpOptions);
  }

  socialLogin(data: any):Observable<any> {
    return this.http.post(this.url+'/social-login', data, httpOptions);
  }
}
