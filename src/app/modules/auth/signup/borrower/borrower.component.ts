import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './../../../../services/user/user.service';
import { OtpComponent } from './../../otp/otp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { CONSTANTS } from 'src/app/common/constants/global-constants';
import { Apollo, gql } from 'apollo-angular';
import { Toast, ToastrService } from 'ngx-toastr';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmPasswordValidator, mustMatch } from '../confirm-password.validator';
import { MustMatch } from '../must-match.validator'

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css'],
})
export class BorrowerComponent implements OnInit {

  borrowerForm: FormGroup = new FormGroup({});
  hidePassword = true;
  hideConfirmPassword = true;
  @Input() currentUserTypeId: any;
  EMAIL_VALIDATION_PATTERN: string = CONSTANTS.EMAIL_VALIDATION_PATTERN;
  submitted = false;

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private apollo: Apollo,
    private _userService: UserService,
    private _borrowerService: BorrowerService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<OtpComponent>
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.borrowerForm = this._formBuilder.group({
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
      // ConfirmPasswordValidator("passowrd","confirmPassword"),
      // mustMatch("passowrd", "confirmPassword")
      {
        validator: MustMatch('password', 'confirmPassword')
      }

    );
  }

  createUser(data, currentUserTypeId) {

    this._userService.createUser(data, currentUserTypeId).subscribe((result: any) => {
      if (result?.data?.createUser != null) {

        const user = {
          username: this.borrowerForm.value.email,
          password: this.borrowerForm.value.password,
          userId: result?.data?.createUser?.data?.userId,
          attributes: {
            email: this.borrowerForm.value.email,
            phone_number: this.borrowerForm.value.contact,
          },
        };

        this.dialog.closeAll();

        this.dialogRef = this.dialog.open(OtpComponent, {
          minWidth: '400px',
          width: '400px',
          data: { isOtpForSignup: true, user: user },
        });

        this.spinner.hide();

        this.dialogRef.afterClosed().subscribe((res:any) => {
          console.log(res);
          if(res?.message!=null){
            this.toastr.success("Signup Completed")
          }
          else{
            this.toastr.error("Signup Failed")
          }
          
        })
      }
      else {
        this.spinner.hide();
        this.toastr.error(result.errors[0].message);
      }
    },
    (err:any)=>{
      this.toastr.error(err);
      this.spinner.hide();
    })

  }

  get f() {
    return this.borrowerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.borrowerForm.invalid) {
      return;
    }
    else {
      this.spinner.show();
      let pass = this.borrowerForm.get('password').value;
      let confirmPass = this.borrowerForm.get('confirmPassword').value;
      if (pass === confirmPass) {
        this.createUser(this.borrowerForm.value, this.currentUserTypeId);
        this.dialogRef.close();
      }
      else {
        this.toastr.success('Password and Confirm Password not same');
      }

    }


  }
}
