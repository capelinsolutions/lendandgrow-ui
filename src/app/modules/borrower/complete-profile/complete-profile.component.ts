import { Component, OnInit, Input, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { CONSTANTS } from './../../../common/constants/global-constants';
import { UserService } from 'src/app/services/user/user.service';
import { LenderService } from 'src/app/services/lender/lender.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { Borrower } from 'src/app/common/models/borrowerProfile';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss'],
})
export class CompleteProfileComponent implements OnInit {
  
  borrowerPersonalInfo: FormGroup = new FormGroup({});
  borrowerProfile: Borrower = new Borrower();
  EMAIL_VALIDATION_PATTERN: string = CONSTANTS.EMAIL_VALIDATION_PATTERN;
  stepperOrientation: Observable<StepperOrientation>;
  @Input() currentUserTypeId: any;
  srcResult: any;
  isCommercial: any = false;
  isResidential: any = true;
  isMultiFamily: any = false;
  enabled: boolean = false;
  currentId: any = 1;
  indexExpanded: number = -1;
  propertyTypeList: any = [];
  propertyQuestionsList: any = [];
  borrowerData: any = [];
  file: any
  imageURL: any
  myDate: Date;
  hide = true;

  constructor(
    private _userService: UserService,
    private _lendorService: LenderService,
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private _borrowerService: BorrowerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _toast: ToastrService,
    private _authService: AuthServiceService,
    private dialogRef: MatDialogRef<CompleteProfileComponent>,
  ) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.createBorrowerProfileForm();
    this.setBorrowerData(this.data)

  }

  close() {
    this.dialogRef.close({ imageUrl: this.imageURL, data: this.borrowerData });
  }

  createBorrowerProfileForm() {
    this.myDate = new Date();
    this.borrowerPersonalInfo = this._formBuilder.group({
      profilePicture: [
        ''
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z ]*$'),
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
          Validators.maxLength(30),
          Validators.pattern(/(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,}/),
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

      telephone: [
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
      dob: [
        [
          this.myDate,
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
      zip: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
      state: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
    });
  }

  removeImage() {
    let UserType = "BORROWER";
    this._userService.removeImage(UserType).subscribe((res: any) => {
      this.imageURL = res.data;
      this._authService.setProfileImage(this.imageURL);
      this.dialogRef.backdropClick().subscribe((result) => {
        if (result) {
          this.dialogRef.close({ imageUrl: this.imageURL, data: this.borrowerData })
        }
      })
    });
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.file = <File>event.target.files[0];
      const formData = new FormData();
      formData.append('file', this.file, this.file.filename);
      formData.append('propertyTypeId', null);
      this.borrowerPersonalInfo.get('profilePicture').setValue(formData);
      this._borrowerService.saveBorrowerImage(formData).subscribe((res: any) => {
        this.imageURL = res.data;
        this._authService.setProfileImage(this.imageURL);
        this.dialogRef.backdropClick().subscribe((res) => {
          if (res) {
            this.dialogRef.close({ imageUrl: this.imageURL, data: this.borrowerData })
          }
        })
      })
    }
  }

  dateFormat(inputDate, format) {

    const date = new Date(inputDate);

    //extract the parts of the date
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    //replace the month
    format = format.replace("MM", month.toString().padStart(2, "0"));

    //replace the year
    if (format.indexOf("yyyy") > -1) {
      format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
      format = format.replace("yy", year.toString().substr(2, 2));
    }

    //replace the day
    format = format.replace("dd", day.toString().padStart(2, "0"));

    return format;
  }

  //convert date from string to date
  stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
  }

  setBorrowerData(data: any) {
    this.borrowerProfile = data;
    this.imageURL = this.borrowerProfile.profileImageURL;

    let borrowerDate = this.dateFormat(this.borrowerProfile.dob, 'yyyy-dd-MM')
    let date = this.stringToDate(borrowerDate, "mm/dd/yyyy", "/")
    this.borrowerPersonalInfo.get('dob').setValue(this.borrowerProfile.dob);
    this.borrowerPersonalInfo.patchValue({
      profilePicture: this.borrowerProfile.profileImageURL,
      name: this.borrowerProfile.name,
      email: this.borrowerProfile.email,
      password: this.borrowerProfile.password,
      contact: this.borrowerProfile.contact,
      address: this.borrowerProfile.address,
      country: this.borrowerProfile.country,
      city: this.borrowerProfile.city,
      telephone: this.borrowerProfile.telephone,
      dob: borrowerDate,
      zip: this.borrowerProfile.zip,
      state: this.borrowerProfile.state,
    });
  }

  submit() {
    if (this.borrowerPersonalInfo.valid) {
      this.spinner.show();
      let borrowerDate = this.dateFormat(this.borrowerPersonalInfo.get('dob').value, 'yyyy-dd-MM');
      this.borrowerPersonalInfo.get('dob').setValue(borrowerDate);
      let userInformation = {
        ...this.borrowerPersonalInfo.value,
        borrowerId: this.data.borrowerId,
        userId: this.data.userId
      }
      this.borrowerProfile = this.borrowerPersonalInfo.value
      this._borrowerService.updateBorrowerProfile(userInformation).subscribe((res: any) => {
        if (res?.data?.updateBorrower == null) {
          if (res?.errors[0]?.message) {
            this._toast.error(res?.errors[0]?.message);
            this.spinner.hide();
          }
          else {
            this.spinner.hide();
          }
        }
        else {
          this.borrowerData = res;
          this.spinner.hide();
          this.dialogRef.close({ imageUrl: this.imageURL, data: this.borrowerData });
          this._toast.success(res?.data?.updateBorrower?.message);
        }
      }, (err: any) => {
        this._toast.error(err?.error?.message)
        this.spinner.hide();
      })
    }
  }
}