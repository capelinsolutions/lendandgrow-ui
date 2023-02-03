import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CONSTANTS } from '../../../common/constants/global-constants';
import { UserService } from 'src/app/services/user/user.service';
import { LenderService } from 'src/app/services/lender/lender.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { HttpClient } from '@angular/common/http';
import { PropertyQuestionsList } from 'src/app/common/models/createProperty.model';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {

  lenderPersonalInfo: FormGroup = new FormGroup({});
  feeStructureArray: any = [];
  EMAIL_VALIDATION_PATTERN: string = CONSTANTS.EMAIL_VALIDATION_PATTERN;
  stepperOrientation: Observable<StepperOrientation>;
  @Input() currentUserTypeId: any;
  srcResult: any
  enabled: boolean = false;
  indexExpanded: number = -1;
  propertyTypeList: any = []
  propertyQuestionsList: Array<any> = []
  QuestionsList: any = []
  lenderData: any = []
  questionArray: Array<any> = [];
  panelOpenState: boolean = false;
  selectedPropertyAndQuestions: Array<any> = [];
  selectedQuestions: Array<any> = [];
  selectedAllQuestions: Array<any> = [];
  selectedPropertyboollist: Array<boolean> = [];
  checked: boolean = true;
  propertyCheck: boolean = true;
  subject$ = new Subject();
  allChecked: Array<boolean> = [];
  fileName = '';
  imageURL = ""
  updatedData: boolean = false;
  getAllFormByListOfIdData: Array<any> = []
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
    private dialogRef: MatDialogRef<CompleteProfileComponent>,
    private _toast: ToastrService,
    private _authService: AuthServiceService,
    private _changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.getPropertyAndQuestions();
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }


  otherInfo = this._formBuilder.group({
    feeStructure: ['', Validators.required],
    propertyInterest: [''],
    propertyQuestions: this._formBuilder.array([]),
  })

  ngOnInit(): void {
    this.createForm();
    this.getInvestor();
    this.getPropertyAndQuestions();
    this.getFreeStructure();
  }
  
  removeImage(){
    console.log("Remove api hit");
    let UserType="INVESTOR";
    this._userService.removeImage(UserType).subscribe((res:any)=>{
      this.imageURL = res.data;
      const new_obj = { ...this.data, profileImageURL: this.imageURL }
        this._authService.setProfileImage(this.imageURL);
        this.dialogRef.backdropClick().subscribe((result) => {
          if (result) {
            this.dialogRef.close({ imageUrl: this.imageURL, data: new_obj })
          }
        })
    });
    
  }

  onFileSelected(event) {
    console.log(event);

    const file: File = event.target.files[0];
    console.log(file, "file is");

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file, this.fileName);
      formData.append("propertyTypeId", null);
      this._userService.uploadImageApi(formData).subscribe((res: any) => {
        console.log(res, "image api response");
        this.imageURL = res.data;
        this.lenderPersonalInfo.controls['profilePicture'].setValue(this.imageURL);
        this.updatedData = true;
        const new_obj = { ...this.data, profileImageURL: this.imageURL }
        this._authService.setProfileImage(this.imageURL);
        this.dialogRef.backdropClick().subscribe((result) => {
          if (result) {
            this.dialogRef.close({ imageUrl: this.imageURL, data: new_obj })
          }

        })
      });
    }
  }
  close() {
    this.dialogRef.close({ imageUrl: this.imageURL, data: this.data });
  }

  createForm() {
    this.myDate = new Date();
    this.lenderPersonalInfo = this._formBuilder.group({
      profilePicture: [
        'ads'
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
        "",
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
      about: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
          Validators.pattern(''),
        ],
      ],
      additionalLanguage: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
      designation: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
      companyName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
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
        ],
      ],
      gender: [
        '',
        [
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

  getFreeStructure() {
    this._lendorService.getfeeStructure().subscribe((d: any) => {
      this.feeStructureArray = d.data.getAllFeeStructure.data;
    });
  }

  //covert date format
  dateFormat(inputDate, format) {
    //parse the input date
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


  getInvestor() {
    console.log(this.data, "Investor data from profile component");
    this.lenderData = this.data;
    console.log("Single lender", this.lenderData)
    this.imageURL = this.lenderData.profileImageURL;

    console.log(this.lenderData.dob,"Lender Data from date");
    
    console.log('Converted date: ' + this.dateFormat(this.lenderData.dob, 'yyyy-dd-MM'));
    let lenderDate = this.dateFormat(this.lenderData.dob, 'yyyy-dd-MM')
    // let date=this.stringToDate(lenderDate,"mm/dd/yyyy","/")
    this.otherInfo.patchValue({feeStructure:this.lenderData.feeStructureId})
    this.lenderPersonalInfo.get('dob').setValue(lenderDate);
    this.lenderPersonalInfo.patchValue({
      profilePicture: this.lenderData.profileImageURL,
      name: this.lenderData.name,
      email: this.lenderData.email,
      password: this.lenderData.password,
      contact: this.lenderData.contact,
      telephone: this.lenderData.telephone,
      address: this.lenderData.address,
      country: this.lenderData.country,
      city: this.lenderData.city,
      about: this.lenderData.about,
      additionalLanguage: this.lenderData.additionalLanguage,
      designation: this.lenderData.occupation,
      gender: this.lenderData.gender,
      zip: this.lenderData.zip,
      state: this.lenderData.state,
      companyName: this.lenderData.companyName
    })
  }

  getPropertyAndQuestions() {
    const checkArray: FormArray = this.otherInfo.get('propertyQuestions') as FormArray;

    this._lendorService.getAllFormByListOfId().subscribe((res: any) => {
      console.log(res, "Response");
      if (res.data != null) {
        this.getAllFormByListOfIdData = res.data.getAllFormByListOfId.data;

        console.log('Property Questions', this.getAllFormByListOfIdData);
        
        for (let i = 0; i < this.getAllFormByListOfIdData.length; i++) {

          this.propertyQuestionsList[i] = res.data.getAllFormByListOfId.data[i];

          this.propertyQuestionsList[i].forms.forEach((item: any, i: number) => {
            let arr: Array<any> = this.otherInfo.get('propertyQuestions').value;
            
            if (item.isSelected != false) {
              if (arr.includes(item.id)) {
                return;
              }
              else {
                checkArray.push(new FormControl(item.id));
              }
            }
          })
          if (this.propertyQuestionsList[i].forms.some((element: any) => element.isSelected == false)) {
            this.allChecked[i] = false;
          }
          else{
            this.allChecked[i] = true;
            this.checkAll(i);
          }
        }

      }

    })
  }

  onSelectQuestion(event: any, questionId: any, propertyId: any) {
    console.log("Selected question id" + questionId);
    const checkArray: FormArray = this.otherInfo.get('propertyQuestions') as FormArray;
    if (event == true) {
      var i = 0;
      checkArray.controls.forEach((item: any) => {
        item.checked = true;
        i++;
      });
      this.selectedQuestions.push({ questionId: questionId, checked: event, propertyTypeId: propertyId });
      console.log(this.selectedQuestions);
    }
    else {
      this.selectedQuestions = this.selectedQuestions.filter((d) => d.questionId != questionId);
      console.log(this.selectedQuestions, "not selected");
    }
  }

  selectAll(event: any, propertyTypeId: any, index: number) {
    console.log(this.propertyQuestionsList, "Question list by property");
    console.log(event, "Event is");
    if (event == true) {
      this.allChecked[index] = true;
      let checkArray: FormArray = this.otherInfo.get('propertyQuestions') as FormArray;
      let arr: Array<any> = this.otherInfo.get('propertyQuestions').value;
      let temp2: any = [...this.propertyQuestionsList[index].forms];
      console.log(temp2, "Temp2");
      temp2.forEach((item: any, i: number) => {
        let temp = { ...item }
        console.log(item);
        if (arr.includes(temp.id)) {
          temp.isSelected = true;
          return;
        }
        else {
          checkArray.push(new FormControl(item.id));
          temp.isSelected = true;
        }
        temp2[i] = temp
      })
      console.log(checkArray.value,"Checkarray");
      this.propertyQuestionsList[index] = {
        ...this.propertyQuestionsList[index],
        forms: temp2,
      };
      console.log(this.propertyQuestionsList[index].forms, "The original object");
    }
    else if (event == false) {
      this.allChecked[index] = false;
      const checkArray: FormArray = this.otherInfo.get('propertyQuestions') as FormArray;
      let arr: Array<any> = this.otherInfo.get('propertyQuestions').value;
      let temp2 = [...this.propertyQuestionsList[index].forms]
      console.log(temp2,"Temp2");
      
      temp2.forEach((item: any, i: number) => {
        let temp = { ...item }
        console.log(item,"Item");
        var ind = 0;

        checkArray.controls.forEach((i: any) => {
          // checkArray.removeAt(ind);
          console.log(i,"in");
          
          if(i.value==temp.id){
            checkArray.removeAt(i)
          }
          ind++;
        });
        temp.isSelected = false;
        temp2[i] = temp
      })
      console.log(checkArray.value,"Checkarray");
      
      this.propertyQuestionsList[index] = {
        ...this.propertyQuestionsList[index],
        forms: temp2,
      };
      console.log(this.propertyQuestionsList[index].forms, "The original object");

    }
    this.checkAll(index);
  }

  checkAll(index: any) {
    const checkArray: FormArray = this.otherInfo.get('propertyQuestions') as FormArray;
    let arr: Array<any> = this.otherInfo.get('propertyQuestions').value;
    let temp2 = [...this.propertyQuestionsList[index].forms]
    if (this.allChecked[index]) {
      if (temp2.some((element: any) => element.isSelected == false)) {
        this.allChecked[index] = false;
      }
    }
    else {
      let counter = 0;
      for (let i = 0; i < temp2.length; i++) {
        if (temp2[i].isSelected != false) {
          counter++;
        }
      }
      if (counter == temp2.length) {
        this.allChecked[index] = true;
      }
    }
  }

  onCheckBoxChange(event: any, questionsValue: any, index: any, j: any) {
    console.log(event, "event");
    const checkArray: FormArray = this.otherInfo.get('propertyQuestions') as FormArray;
    let temp2 = [...this.propertyQuestionsList[index].forms]
    console.log(temp2, "temp2");
    console.log(j, "j value");
    let temp = { ...temp2[j] };
    if (event.checked == true) {
      temp.isSelected = true;
      temp2[j] = temp
      console.log(temp.value, "value");
      // temp.value = "true";
      // this.checkAll(index)
      let arr: Array<any> = this.otherInfo.get('propertyQuestions').value;
      if (arr.includes(questionsValue)) {
        return;
      }
      else {
        checkArray.push(new FormControl(questionsValue));
      }
    }
    else if (event.checked == false) {
      temp.isSelected = false;
      temp2[j] = temp
      if (questionsValue != "" || questionsValue != null) {
        let arr: Array<any> = this.otherInfo.get('propertyQuestions').value;
        if (arr.includes(questionsValue)) {
          var i = 0;
          checkArray.controls.forEach((item: any) => {
            if (item.value == questionsValue) {
              checkArray.removeAt(i);
              return;
            }
            i++;
          });
        }
      }
      // this.checkAll(index)
    }
    this.propertyQuestionsList[index] = {
      ...this.propertyQuestionsList[index],
      forms: temp2,
    };
    this.checkAll(index);//coomented now
    console.log(this.propertyQuestionsList[index].forms);
    // if (questionsValue && event.checked == true) {
    //   let arr: Array<any> = this.otherInfo.get('propertyQuestions').value;
    //   if (arr.includes(questionsValue)) {
    //     return;
    //   }
    //   else {
    //     checkArray.push(new FormControl(questionsValue));
    //   }
    // }
    // else {
    //   var i = 0;
    //   checkArray.controls.forEach((item: any) => {
    //     if (item.value == event.source.value) {
    //       checkArray.removeAt(i);
    //       return;
    //     }
    //     i++;
    //   });
    // }
    // this.checkAll(index)//commented now
  }

  updateInvestorData(data) {
    this._lendorService.updateInvestor(data).subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.data = res;
        this.dialogRef.close({ imageUrl: this.imageURL, data: this.data });
        // this.dialog.closeAll();
        this._toast.success("Profile Updated Successfully");
      }
      console.log(res, "Updated data");
      
    })
  }
  submit() {
    const checkArray: FormArray = this.otherInfo.get('propertyQuestions') as FormArray;
    console.log(checkArray, "control items");
    console.log(this.selectedQuestions, "Selected");
    console.log(this.lenderPersonalInfo.value);
    console.log(this.otherInfo.value);
    let borrowerDate = this.dateFormat(this.lenderPersonalInfo.get('dob').value, 'yyyy-dd-MM');
    this.lenderPersonalInfo.get('dob').setValue(borrowerDate);
    let userInformation = {
      ...this.lenderPersonalInfo.value,
      ...this.otherInfo.value,
      investorId: this.lenderData.investorId,
      userId: this.lenderData.userId
    }
    let ids = { investorId: this.lenderData.investorId, userId: this.lenderData.userId }
    console.log(ids, "ids are");
    console.log(userInformation, "User information");
    this.updateInvestorData(userInformation);
    this.spinner.show();
  }
}