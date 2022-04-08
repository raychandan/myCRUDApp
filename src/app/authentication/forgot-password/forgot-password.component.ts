import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { RouterService } from 'src/app/shared/services/router.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  authenticatePath = environment.authenticate.basePath;
  signupPath = "/"+this.authenticatePath+ '/' + environment.authenticate.signup;
  fogotPasswordForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private routerService: RouterService
  ) { }

  ngOnInit(): void {
    this.fogotPasswordForm = this.formBuilder.group({
      Email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      })
    });
  }

  get Email(): AbstractControl {
    return this.fogotPasswordForm.get(`Email`) as AbstractControl;
  }

  onSubmit(){
    this.submitted = true;

    if (this.fogotPasswordForm.valid) {
      this.authService.forgotPassword(this.fogotPasswordForm.getRawValue()).subscribe((data:any)=>{
        this.toastr.success(data.Message)
        this.routerService.redirectHome();
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

}
