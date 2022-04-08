import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {

  constructor() { }

  private dataSource: BehaviorSubject<string> = new BehaviorSubject<string>('{}');
  data: Observable<string> = this.dataSource.asObservable();
 
  sendData(data: string) {
    this.dataSource.next(data);
  }
}
