import { OtpComponent } from './../../otp/otp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CONSTANTS } from '../../../../common/constants/global-constants';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { env } from 'process';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { cloneDeep } from '@apollo/client/utilities';
import { Auth } from 'aws-amplify';
import { UserService } from 'src/app/services/user/user.service';
import { LenderService } from 'src/app/services/lender/lender.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MustMatch } from '../must-match.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lender',
  templateUrl: './lender.component.html',
  styleUrls: ['./lender.component.css']
})
export class LenderComponent implements OnInit {

  lenderPersonalInfo: FormGroup = new FormGroup({});
  hidePassword = true;
  hideConfirmPassword = true;
  EMAIL_VALIDATION_PATTERN: string = CONSTANTS.EMAIL_VALIDATION_PATTERN;
  stepperOrientation: Observable<StepperOrientation>;
  @Input() currentUserTypeId: any;

  constructor(private toastr: ToastrService,private _userService: UserService, public dialogRef: MatDialogRef<OtpComponent>, private _lendorService: LenderService, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private dialog: MatDialog, private spinner: NgxSpinnerService,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.createForm();
  }



  createForm() {
    this.lenderPersonalInfo = this._formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)*$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            /(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,}/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            /(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,}/
          ),
        ],
      ],
      contact: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(
            /[1]{1}-[0-9]{3}-[0-9]{3}-[0-9]{4}$/
          ),
        ],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
      country: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }

  // createOtherInfoForm(){
  //   this.otherInfo = this._formBuilder.group({
  //     productOffer: ['', Validators.required],
  //     feeStructure: ['', Validators.required],
  //     requiredDocs: new FormArray([])
  //   })


  //   const group: any = {};
  //   group['document'] = new FormControl('', Validators.required);
  //   this.requiredDocs.push(new FormGroup(cloneDeep(group)));

  //   console.log(this.otherInfo);

  // }

  // addDoc(){
  //   const group: any = {};
  //   group['document'] = new FormControl('', Validators.required);
  //   this.requiredDocs.push(new FormGroup(cloneDeep(group)));
  //   console.log(this.otherInfo);
  // }

  // removeDoc(index: number){
  //   this.requiredDocs.removeAt(index);
  //   console.log(this.otherInfo);

  // }

  // get requiredDocs(){
  //   return this.otherInfo.get('requiredDocs') as FormArray;
  // }

  // createUserInDB(user) {
  //   let data = {
  //     email: this.lenderPersonalInfo.value.email,
  //     currentUserTypeId: this.currentUserTypeId,
  //     userSub: user.userSub,
  //   }
  //   this._userService.createUser(data)
  //   .pipe(
  //     switchMap((result: any) => this._lendorService.createInvestor({
  //       userId: result?.data?.createUser?.data?.userId,
  //       name: this.lenderPersonalInfo.value.name,
  //       password: this.lenderPersonalInfo.value.password,
  //       address: this.lenderPersonalInfo.value.address,
  //       city: this.lenderPersonalInfo.value.city,
  //       country: this.lenderPersonalInfo.value.country,
  //       contactNumber: this.lenderPersonalInfo.value.contact,
  //       userTypeId: this.currentUserTypeId
  //     }) )
  //   )
  //     .subscribe((result: any) => {
  //       console.log('RESO:E', result);
  //       this.dialog.closeAll();

  //       this.dialog.open(OtpComponent, {
  //         minWidth: '400px',
  //         width: '400px',
  //         data: { isOtpForSignup: true, user:user.user },
  //       });
  //       this.spinner.hide();
  //       //  this.userData = result.data.getUserTypes.data
  //     });
  // }


  createUser(data, currentUserTypeId) {
    this._userService.createUser(data, currentUserTypeId).subscribe((result:any) => {
      if (result?.data.createUser!=null) {
        const user = {
          username: this.lenderPersonalInfo.value.email,
          password: this.lenderPersonalInfo.value.password,
          userId: result.data.createUser.data.userId,
          attributes: {
            email: this.lenderPersonalInfo.value.email,
            phone_number: this.lenderPersonalInfo.value.contact,
          },
        };
        this.dialogRef = this.dialog.open(OtpComponent, {
          minWidth: '400px',
          width: '400px',
          data: { isOtpForSignup: true, user: user },
        });
        this.dialogRef.afterClosed().subscribe((res) => {
          if(res?.message!=null){
            this.toastr.success("Signup Completed")
          }
          else{
            this.toastr.error("Signup Failed")
          }
        },
        (err:any)=>{
          this.toastr.error(err.error.error_description)
        }
        )
        this.spinner.hide();
      }
      else{
        this.spinner.hide();
        this.toastr.error(result.errors[0].message);
      }
    },
    (err:any)=>{
      this.toastr.error(err);
      this.spinner.hide();
    }
    )

  }

  get f() {
    return this.lenderPersonalInfo.controls;
  }

  submit() {
    if (this.lenderPersonalInfo.invalid) {
      return;
    }
    else {
      this.spinner.show();
      let pass = this.lenderPersonalInfo.get('password').value;
      let confirmPass = this.lenderPersonalInfo.get('confirmPassword').value;
      if (pass === confirmPass) {
        this.createUser(this.lenderPersonalInfo.value, this.currentUserTypeId);
      }
    }
    this.dialog.closeAll();
  }
}
