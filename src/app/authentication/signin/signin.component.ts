import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { TokenServiceService } from 'src/app/shared/services/token-service.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { RouterService } from 'src/app/shared/services/router.service';

import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider} from "angularx-social-login";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  authenticatePath = environment.authenticate.basePath;
  signupPath = "/"+this.authenticatePath+ '/' + environment.authenticate.signup;
  forgotPasswordPath = "/"+this.authenticatePath+ '/' + environment.authenticate.forgotPassword;
  loginForm: FormGroup;
  submitted = false;
  public user: SocialUser;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private tokenService: TokenServiceService,
    private SocialauthService: SocialAuthService,
    private localStorageService: LocalStorageService,
    private routerService: RouterService,
    private _cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.SocialauthService.authState.subscribe(user => {
      this.user = user;
      if(user != null){
        let userObj = {Email: user.email, Name: user.name}
        this.socialLogin(userObj);
      }
      console.log(user, "user");
    });

    let email= '';
    let password= '';
    let remember: boolean = false;
    if (this._cookieService.check('remember')) {
      remember = this._cookieService.get('remember') == 'true' ? true : false;
      if(remember){
        email = this._cookieService.get('Email');
        password = this._cookieService.get('Password');
      }
    }
    this.loginForm = this.formBuilder.group({
      Email: new FormControl(email, {
        validators: [Validators.required, Validators.email]
      }),
      Password: [password, Validators.required],
      remember: [remember]
    });
  }

  get Email(): AbstractControl {
    return this.loginForm.get(`Email`) as AbstractControl;
  }

  get Password(): AbstractControl {
    return this.loginForm.get('Password') as AbstractControl;
  }

  onSubmit(){
    this.submitted = true;

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue()).subscribe((data:any)=>{
        this.localStorageService.setUserDetails(data);
        this.localStorageService.setAuthToken(data.AccessToken);
        this.tokenService.sendData(JSON.stringify(data));
        if (this.loginForm.value.remember == true) {
          this._cookieService.set('remember', 'true');
          this._cookieService.set('Email', this.loginForm.value.Email);
          this._cookieService.set(
            'Password',
            this.loginForm.value.Password
          );
        }else if(this.loginForm.value.remember == false){
            if (this._cookieService.check('remember')) {
                this._cookieService.delete('remember');
                this._cookieService.delete('Email');
                this._cookieService.delete('Password');
            }
        }
        this.routerService.redirectHome();
        this.toastr.success("Login successfully");
      },
      (err:any)=>{
        if(err.status == 400)
        this.toastr.error(err.error.message);
        else
        this.toastr.error("Something went wrong");
      }
      )
    }else{
      this.toastr.error("Please check all fields");
    }
  }

  public signInWithGoogle(): void {
    this.SocialauthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  public signInWithFB(): void {
    this.SocialauthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  public signOut(): void {
    this.SocialauthService.signOut();
  }

  socialLogin(data: any){
    if (data != '') {
      this.authService.socialLogin(data).subscribe((data:any)=>{
        this.localStorageService.setAuthToken(data.AccessToken);
        this.localStorageService.setUserDetails(data);
        this.tokenService.sendData(JSON.stringify(data));
        this.routerService.redirectHome();
        this.toastr.success("Login successfully");
      },
      (err:any)=>{
        if(err.status == 400)
        this.toastr.error(err.error.message);
        else
        this.toastr.error("Something went wrong");
      }
      )
    }else{
      this.toastr.error("Please check all fields");
    }
  }

}
