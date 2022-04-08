import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { RouterService } from 'src/app/shared/services/router.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  authenticatePath = environment.authenticate.basePath;
  signinPath = "/"+this.authenticatePath+ '/' + environment.authenticate.signin;
  registerForm: FormGroup;
  submitted = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  openCropModal = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private routerService: RouterService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      Email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      Password: ['', Validators.required],
      Name: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      AgreeTerm: ['', Validators.required],
      Base64image: ['',Validators.required],
    },
    {
      validator: this.ConfirmPasswordValidator("Password", "ConfirmPassword")
    });
  }

  openFilePopup(){
    let fileInput = $("#file-upload-input");
    fileInput.click();
  }
  changeFileName(event:any){
    let file = event.target.files[0];
    let selectName = $("#file-select-name");
    if(file){
      selectName.html(file.name);
      if(file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg'){
        if(file.size < 2e+6){
          this.openCropModal = true;
          this.fileChangeEvent(event);
        }else{
          this.toastr.error("File size must be below 2MB");
          this.openCropModal = false;
          this.registerForm.patchValue({'Base64image' : ''});
        }
      }else{
        this.toastr.error("Invalid file type");
        this.openCropModal = false;
        this.registerForm.patchValue({'Base64image' : ''});
      }
    }else{
      selectName.html("No file chosen...");
      this.openCropModal = false;
      this.registerForm.patchValue({'Base64image' : ''});
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.registerForm.patchValue({'Base64image' : event.base64});
  }

  closeCropModal(){
    this.openCropModal = false;
  }

  get Name(): AbstractControl {
    return this.registerForm.get(`Name`) as AbstractControl;
  }

  get ConfirmPassword(): AbstractControl {
    return this.registerForm.get('ConfirmPassword') as AbstractControl;
  }

  get AgreeTerm(): AbstractControl {
    return this.registerForm.get('AgreeTerm') as AbstractControl;
  }

  get Email(): AbstractControl {
    return this.registerForm.get(`Email`) as AbstractControl;
  }

  get Password(): AbstractControl {
    return this.registerForm.get('Password') as AbstractControl;
  }

  get Base64image(): AbstractControl {
    return this.registerForm.get('Base64image') as AbstractControl;
  }

  onSubmit(){
    this.submitted = true;

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.getRawValue()).subscribe((data:any)=>{
        this.routerService.redirectSignIn();
        this.toastr.success("Register successfully");
      },
      (err:any)=>{
        console.log("err",err)
        if(err.status == 400)
        this.toastr.error(err.error.message);
        else
        this.toastr.error("Email already exits");
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
