import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {ToastrService} from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { RouterService } from 'src/app/shared/services/router.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  authenticatePath = environment.authenticate.basePath;
  signinPath = "/"+this.authenticatePath+ '/' + environment.authenticate.signin;
  resetPasswordForm: FormGroup;
  submitted = false;
  token:string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private routerService: RouterService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'] != null && params['token'] !== undefined ? params['token'] : ""
    });
    console.log("token", this.token);
    this.resetPasswordForm = this.formBuilder.group({
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      ResetPasswordToken: [this.token],
    },
    {
      validator: this.ConfirmPasswordValidator("Password", "ConfirmPassword")
    });
  }

  get ConfirmPassword(): AbstractControl {
    return this.resetPasswordForm.get('ConfirmPassword') as AbstractControl;
  }

  get Password(): AbstractControl {
    return this.resetPasswordForm.get('Password') as AbstractControl;
  }

  onSubmit(){
    this.submitted = true;
    console.log("resetPasswordForm",this.resetPasswordForm.getRawValue())
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.resetPasswordForm.getRawValue()).subscribe((data:any)=>{
        this.routerService.redirectSignIn();
        this.toastr.success("Password saved successfully");
      },
      (err:any)=>{
        console.log("err",err)
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

  ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName]
      if (
        matchingControl.errors &&
        !matchingControl.errors?.['confirmPasswordValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

}
