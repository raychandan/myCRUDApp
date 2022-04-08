import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { AuthServiceService } from 'src/app/shared/services/auth-service.service';
import {ToastrService} from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { SocketService } from 'src/app/shared/services/socket.service';
declare var $: any; 

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: any;
  userForm: FormGroup;
  submitted = false;
  imageUrl = '/assets/images/image-not-found.jpg';
  isEdit = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  openCropModal = false;

  constructor(private userService: UserServiceService, private authService: AuthServiceService,private toastr: ToastrService,private formBuilder: FormBuilder,private socketService: SocketService) { }
  
  ngOnInit(): void {
    let user:any = this.authService.getUserDetails();
    this.getUserDetail(user._id);
    this.connectUserToSocket(user._id);

    this.userForm = this.formBuilder.group({
      Email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      Name: ['', Validators.required],
      _id: ['',Validators.required],
      Base64image: [''],
      isFile: [false],
      DateOfBirth: ['',Validators.required],
      Gender: ['', Validators.required]
    })
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
          this.userForm.patchValue({'isFile' : false, 'Base64image' : ''});
        }
      }else{
        this.toastr.error("Invalid file type");
        this.openCropModal = false;
        this.userForm.patchValue({'isFile' : false, 'Base64image' : ''});
      }
    }else{
      selectName.html("No file chosen...");
      this.openCropModal = false;
      this.userForm.patchValue({'isFile' : false, 'Base64image' : ''});
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.userForm.patchValue({'isFile' : true, 'Base64image' : event.base64});
  }

  closeCropModal(){
    this.openCropModal = false;
  }

  get Name(): AbstractControl {
    return this.userForm.get(`Name`) as AbstractControl;
  }

  get Email(): AbstractControl {
    return this.userForm.get(`Email`) as AbstractControl;
  }

  get DateOfBirth(): AbstractControl {
    return this.userForm.get(`DateOfBirth`) as AbstractControl;
  }

  get Gender(): AbstractControl {
    return this.userForm.get(`Gender`) as AbstractControl;
  }

  getUserDetail(id:any){
    this.userService.getUserById(id).subscribe((data:any)=>{
      this.user= data;
      if(data.Base64image != ''){
        this.imageUrl = data.Base64image
      }
      this.userForm.patchValue(data);
    },
    (err:any)=>{
      if(err.status == 400){
        this.toastr.error(err.error.message)
      }else{
        this.toastr.error("Something went wrong")
      }
    }
    )
  }

  updateUser(){
    this.submitted = true;
    
    if (this.userForm.valid) {
      this.userService.updateUser(this.userForm.getRawValue()._id,this.userForm.getRawValue()).subscribe((data:any)=>{
        if(data.Base64image != ''){
          this.imageUrl = data.Base64image
        }
        this.userForm.patchValue(data);
        this.isEdit = false;
        this.toastr.success("User profile updated successfully");
      },
      (err:any)=>{
        if(err.status == 400)
        this.toastr.error(err.error.message);
        else
        this.toastr.error("Something went worng");
      }
      )
    }else{
      this.toastr.error("Please check all fields");
    }
  }

  changeMode(flag: boolean){
    this.isEdit = flag;
    if(flag == false)
    this.userForm.patchValue(this.user)
  }

  connectUserToSocket(_id:any){
    this.socketService.connectUserToSocket(_id);
  }

  dateChange(event:any){
    if(event.target.value != null){
      let convertDate = new Date(event.target.value).toISOString().substring(0, 10);
      this.userForm.patchValue({"DateOfBirth": convertDate});
    }else{
      this.userForm.patchValue({"DateOfBirth": ''});
    }
  }

}
