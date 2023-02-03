import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { timingSafeEqual } from 'crypto';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTS } from 'src/app/common/constants/global-constants';
import { UserService } from 'src/app/services/user/user.service';
import { MustMatch } from '../signup/must-match.validator';

@Component({
  selector: 'app-reset-screen',
  templateUrl: './reset-screen.component.html',
  styleUrls: ['./reset-screen.component.scss']
})
export class ResetScreenComponent implements OnInit {

  resetForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  EMAIL_VALIDATION_PATTERN: string = CONSTANTS.EMAIL_VALIDATION_PATTERN;ay
  constructor( private formBuilder: FormBuilder,
    private router: Router,private _userService: UserService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.createForm();
    this.getParams();
  }

  token;
  email;
  getParams(){
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');
  }

  createForm(){
    this.resetForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(
          /(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,}/
        ),
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          /(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,}/
        ),
      ])),
    },
    {
      validator: MustMatch('password', 'confirmPassword')
    }
    );
  }

  onSubmit(){
    this.spinner.show();
    let password = this.resetForm.get('password').value;
    let resetPasswordData = {token: this.token,email: this.email,password: password}
    console.log(resetPasswordData);
    this._userService.updatePassword(resetPasswordData).subscribe((res:any)=>{
      console.log(res,"res");
      this.spinner.hide();
      if(res?.data?.updateForgetPassword==null){
        if(res?.errors[0]?.message){
          this.toastr.error(res?.errors[0]?.message);
          this.spinner.hide();
        }
        else{
          this.spinner.hide();
        }
      }
      else{
        this.toastr.success(res?.data?.updateForgetPassword?.message);
        this.router.navigate(['home'])
        this.spinner.hide();
      }
    },(err:any)=>{
      // this.toastr.error(err.errors[0].message);
      this.spinner.hide();
    });
  }

  
}
