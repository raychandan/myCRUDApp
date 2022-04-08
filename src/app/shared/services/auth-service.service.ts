import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  
  constructor(private jwtHelper: JwtHelperService, private localStorageService: LocalStorageService,) { }

  public isAuthenticated(): boolean {
    const token = this.localStorageService.getAuthToken();

    // Check whether the token is expired and return
    // true or false
    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    else {
      return false;
    }
  }

  public getUserDetails(): any {
    if (this.localStorageService.getUserDetails()) {
      let loginUser = this.localStorageService.getUserDetails();
      // loginUser.avatar = this.fileBaseUrl + loginUser.id + '/' + loginUser.avatar
      return loginUser;
    } else {
      return {}
    }
  }

  public logout(): void {
    localStorage.clear();
  }
}
