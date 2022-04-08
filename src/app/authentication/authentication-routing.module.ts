import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { environment } from './../../environments/environment';

let singInPath = environment.authenticate.signin;
let singUpPath = environment.authenticate.signup;
let forgotPasswordPath = environment.authenticate.forgotPassword;
let resetPasswordPath = environment.authenticate.resetPassword;

const routes: Routes = [
  {
    path: '',
    redirectTo: singInPath,
    pathMatch: 'full',
  },
  { path: singInPath, component: SigninComponent },
  { path: singUpPath, component: SignupComponent },
  { path: forgotPasswordPath, component: ForgotPasswordComponent },
  { path: resetPasswordPath+'/:token', component: ResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
