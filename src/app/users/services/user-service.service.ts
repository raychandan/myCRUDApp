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
export class UserServiceService {

  url = environment.apiURL+'/api/user';

  constructor(private http:HttpClient) { }

  getUserById(id: any):Observable<any> {
    return this.http.get(this.url+'/getUserbyId/'+id, httpOptions);
  }

  updateUser(id: any, data:any):Observable<any> {
    return this.http.post(this.url+'/updateUser/'+id, data, httpOptions);
  }
}
