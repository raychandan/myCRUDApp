import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { environment } from 'src/environments/environment';

let env = environment;
let home = env.home.basePath;
let authenticate = env.authenticate;
let singUpRedirectPath = "/" + authenticate.basePath + "/" + authenticate.signup;
let singInRedirectPath = "/" + authenticate.basePath + "/" + authenticate.signin;
let forgotPassRedirectPath = "/" + authenticate.basePath + "/" + authenticate.forgotPassword;
let resetPassRedirectPath = "/" + authenticate.basePath + "/" + authenticate.resetPassword;


@Injectable({
  providedIn: 'root'
})
export class RouterService {
  private readonly extras: NavigationExtras = { skipLocationChange: true };
  constructor(private router: Router) { }

  public redirectHome() {
    this.router.navigate([home], { skipLocationChange: false });
  }
  public redirectSignup() {
    this.router.navigate([singUpRedirectPath], { skipLocationChange: false });
  }
  public redirectSignIn() {
    this.router.navigate([singInRedirectPath], { skipLocationChange: false });
  }
  public redirectForgotPassword() {
    this.router.navigate([forgotPassRedirectPath], { skipLocationChange: false });
  }
  public redirectResetPassword() {
    this.router.navigate([resetPassRedirectPath], { skipLocationChange: false });
  }
}
