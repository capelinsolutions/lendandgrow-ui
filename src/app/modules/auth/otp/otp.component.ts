import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {

  @ViewChild('ngOtpInput') ngOtpInputRef: any;
  config: any = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };
  showTimer: boolean = true;
  timer: number = 60;
  otp: any = '';
  isVerified: boolean = false;

  constructor(private spinner: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any,
  private router: Router,private _userService: UserService,private _toast: ToastrService,
  private dialogRef: MatDialogRef<OtpComponent>,private _authService: AuthServiceService) {}

  ngOnInit(): void {
    console.log(this.data,"data coming to otp component is");
    this.spinner.hide();
    setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.showTimer = false;
      }
    }, 1000);
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

  // Activate User in DB
  activateUser(data){
    let message = ""
      this._userService.verifyOtp(data).subscribe((res:any)=>{
        if(res?.data.verifyOtp.status==200){
          this.spinner.hide();
          message="Signup Completed";
          this.dialogRef.close({message: message});
        }
        else{
          this._toast.warning("Wrong Otp");
        }
      })
  }

  onSubmit() {
    this.spinner.show();
    if(this.data.isOtpForSignup){
      let data ={
        email: this.data.user.username,
        otp: this.otp
      }
      this.activateUser(data);
    }
   else if(this.data.isOtpForLogin){
    let data ={
      email: this.data.user.username,
      password: this.data.user.password,
      otp: this.otp
    }
    this.dialogRef.close({data: data});
   }
  }
  resendOtp() {
    this.spinner.show();
    setTimeout(() => {
      this.showTimer = true;
      this.timer = 60;
      this.spinner.hide();
      if(this.data.isOtpForLogin){
        let data ={
          email: this.data.user.username,
          password: this.data.user.password,
        }
        const formData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('username', data.email);
        formData.append('password', data.password);
        this._authService.login(formData).subscribe((res: any)=>{
          console.log(res,"Response coming");
        },(err:any)=>{
          console.log(err,"Error");
        });
      }
      else if(this.data.isOtpForSignup){
        let data ={
          email: this.data.user.username,
          password: this.data.user.password,
          userId: this.data.user.userId
        }
        console.log(data);
        
        this._userService.resendOtp(data.userId).subscribe((res)=>{
          console.log(res);
        });
      }
    }, 1000);
  }
}
