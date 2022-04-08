import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService) {}
  private setBasicHeaders(headers: HttpHeaders) {
		const token = this.localStorageService.getAuthToken(); // Figure out, from where to take token
		headers.set('authorization', token);
		headers.append('Accept', 'application/json');
		headers.append('content-type', 'Application/Json');
	}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.localStorageService.getAuthToken()) {
			request = request.clone({
				setHeaders: {
					authorization:`Bearer ${this.localStorageService.getAuthToken()}`
				}
			});
		}
    return next.handle(request);
  }
}
