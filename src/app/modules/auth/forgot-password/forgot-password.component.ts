import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  timeLeft: number = 60;
  interval : any;
  disableButton : boolean = false;
  showTimer : boolean = false;
  email: FormControl = new FormControl('', [Validators.required, Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$')]);

  constructor(
    private _userService: UserService,
    private _toast: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  requestLink(event){
    event.preventDefault();
    console.log(this.email.value,"Email");
    this.spinner.show();
    this._userService.forgetPassword(this.email.value).subscribe((res: any)=>{
      console.log(res,"forget res");
      if(res?.data?.createForgetPasswordLink!=null){
        this.timer()
;        this._toast.success(res?.data?.createForgetPasswordLink?.message);
        this.spinner.hide();
      }
      else{
        if(res?.errors[0]?.message){
          this._toast.error(res?.errors[0]?.message);
          this.spinner.hide();
        }
        else{
          this.spinner.hide();
        }
      }          
      
    },(err: any)=>{
      this._toast.error(err?.message)
      this.spinner.hide();
    })
  }

  timer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.showTimer = true;
        this.disableButton = true;
        this.timeLeft--;
      } 
      else if(this.timeLeft == 0) {
        this.timeLeft = 0;
        this.disableButton = false;
        this.showTimer = false;
      }
    },1000)
  }

}
