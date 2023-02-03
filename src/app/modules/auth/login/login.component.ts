import { OtpComponent } from './../otp/otp.component';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs/internal/Subscription';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { LenderService } from 'src/app/services/lender/lender.service';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { CONSTANTS } from 'src/app/common/constants/global-constants';
import { AppConstants } from 'src/app/common/constants/app-constants';
import { Apollo, gql } from 'apollo-angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  hide = true;
  EMAIL_VALIDATION_PATTERN: string = CONSTANTS.EMAIL_VALIDATION_PATTERN;
  error_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Please provide valid email.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be greater than 7 digits.' },
      { type: 'maxlength', message: 'Password must be less than 17 digits' },
    ],
    otp: [{ type: 'required', message: 'OTP is required.' }],
    totp: [{ type: 'required', message: 'OTP is required.' }],
  };

  dashboardRoute: any = ""
  lenderDashboardData: any = [
    {
      heading: "Contacted Borrowers",
      icon: "",
      total: 200
    },
    {
      heading: "Successful Deals",
      icon: "",
      total: 200
    },
    {
      heading: "Invested Amount",
      icon: "",
      total: 200
    }
  ]
  borrowerDashboardData: any = [
    {
      heading: "Contacted Lenders",
      icon: "",
      total: 200
    },
    {
      heading: "Successful Deals",
      icon: "",
      total: 200
    },
    {
      heading: "Properties Sold",
      icon: "",
      total: 200
    }
  ]
  borroweritem: any =
    [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        url: '/borrower/dashboard'
      },
      {
        title: 'Profile',
        icon: 'account_circle',
        url: '/borrower/profile'
      },
      {
        title: 'Investor List',
        icon: 'list',
        url: '/borrower/lender/list'
      },
      {
        title: 'My Property',
        icon: 'home',
        url: '/borrower/profile/property'
      },

      {
        title: 'Messages',
        icon: 'history',
        url: '/borrower/history'
      },
      {
        title: 'My Documents',
        icon: 'insert_drive_file',
        url: '/borrower/documents'
      },
      // {
      //   title: 'Logout',
      //   icon: 'logout',
      //   url: '/'
      // }
    ]
  lenderitem: any =
    [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        url: '/borrower/dashboard'
      },
      {
        title: 'My Profile',
        icon: 'account_circle',
        url: '/lender/profile'
      },
      {
        title: 'Messages',
        icon: 'history',
        url: '/lender/history'
      },
      {
        title: 'Borrower List',
        icon: 'list',
        url: '/lender/borrower/list'
      }
    ];

  items: any = [{
    icon: "home",
    title: 'My Profile',
    url: '/lender/profile'
  }];

  userData: any;
  notificationList : Array<any> = [];
  notificationCount : any = 0;
  Subscription: Subscription;
  isLoggedIn: any = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _userService: UserService,
    private _authService: AuthServiceService,
    private _lenderService: LenderService,
    private _borrowerService: BorrowerService,
    private _graphqlService : GraphqlService,
    public dialogRef: MatDialogRef<OtpComponent>,
    private apollo: Apollo,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          /(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,}/
        ),
      ])),
    });
  }
  
  loginUser() {
    this.spinner.show();
    try {
      const formData = new FormData();
      formData.append('grant_type', 'password');
      formData.append('username', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);
      const user = {
        username: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      this._authService.setItems(this.items);

      this._authService.login(formData).subscribe((res: any) => {
        console.log(res, "Response coming");
        if (res.status == 200) {
          this.dialogRef = this.dialog.open(OtpComponent, {
            minWidth: '400px',
            width: '400px',
            data: { isOtpForLogin: true, user: user },
          });
          this.dialogRef.afterClosed().subscribe((res) => {
            console.log(res, "After otp is back");
            if (res?.data?.otp) {
              formData.append('otp', res.data.otp);
              this._authService.loginStep2(formData).subscribe((result: any) => {
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('expires_in', result.expires_in);
                localStorage.setItem('refresh_token', result.refresh_token);
                localStorage.setItem('token_type', result.token_type);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('email', this.loginForm.value.email);
                this._authService.setButton(true);
                this._authService.isLoggedInSource.next(true);
                if (result) {
                  this._userService.getUserByEmail().subscribe((response: any) => {
                    if (response) {
                      let currentUserTypeId = response.data.loadByUsername.data.userType;
                      localStorage.setItem("RoleId", currentUserTypeId);
                      localStorage.setItem('userId',response?.data.loadByUsername.data.userId)
                      this.getUserData(currentUserTypeId);
                      this.ngOnInit();
                      if (currentUserTypeId == AppConstants.LENDER_ID) {
                        this._authService.setItems(this.lenderitem);
                        this._authService.setDashboardItems(this.lenderDashboardData);
                        this.dashboardRoute = '/lender/dashboard';
                        this.router.navigate(['lender/dashboard'])
                      }
                      else if (currentUserTypeId == AppConstants.BORROWER_ID) {
                        this._authService.setItems(this.borroweritem);
                        this._authService.setDashboardItems(this.borrowerDashboardData);
                        this.dashboardRoute = '/borrower/dashboard';
                        this.router.navigate(['borrower/dashboard'])
                      }
                    }
                  })
                }
                this.spinner.hide();
                this.dialog.closeAll();
                this.router.navigate([this.dashboardRoute]);
              }, (err: any) => {
                console.log(err);
                this.spinner.hide();
                this.dialog.closeAll();
                this.toastr.error(err.error.message);
              })
            }
            else{
              this.spinner.hide();
              this.dialog.closeAll();
              this.toastr.error("Login Failed");
            }
          },
            (err: any) => {
              if (err.status == 0) {
                this.toastr.error("Unknown Error");
                this.spinner.hide();
                this.dialog.closeAll();
              }
              else {
                this.spinner.hide();
                this.dialog.closeAll();
                this.toastr.error(err.error.error_description);
              }
            });
        }
      }, (err: any) => {
        console.log(err, "Error");
        this.spinner.hide();
        this.dialog.closeAll();
        this.toastr.error(err.error.message? err.error.message: "Something went wrong");
      });//first step login

      // this.dialog.closeAll();

    }
    catch (error) {
      // console.log(error, "Error is")
      this.spinner.hide();
      this.dialog.closeAll();
      this.toastr.error("Invalid Credentials")
    }

  }
  getUserData(roleId: any) {
    if (roleId === AppConstants.LENDER_ID) {
      this._lenderService.getSingleInvestor().subscribe((res: any) => {
        this.userData = res.data.getInvestor.data
        this._authService.setUserData(this.userData);
      })
    }
    else if (roleId === AppConstants.BORROWER_ID) {
      this._borrowerService.getSingleBorrower().subscribe((res: any) => {
        this.userData = res.data.getBorrower.data
        this._authService.setUserData(this.userData);
      })
    }
  }
  onSubmit() {
    this.loginUser();
  }
  
  openForgotPass() {
    this.dialog.closeAll();
    this.dialog.open(ForgotPasswordComponent, {
      minWidth: '300px'
    });
  }
}
