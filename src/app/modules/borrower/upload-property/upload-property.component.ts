import { Component, OnInit, ViewChild } from '@angular/core';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FieldConfig } from "./../../../common/interface/field.interface";
import { DynamicFormComponent } from "../../../form/dynamic-form/dynamic-form.component";
import { Subject } from 'rxjs';
import { CreateProperty } from 'src/app/common/models/createProperty.model';
import { Console } from 'console';
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upload-property',
  templateUrl: './upload-property.component.html',
  styleUrls: ['./upload-property.component.scss']
})
export class UploadPropertyComponent implements OnInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  propertyModel : CreateProperty = new CreateProperty();

  regConfig: FieldConfig[] = [
    {
      type: "input",
      label: "Username",
      inputType: "text",
      name: "name",

      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Name Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern("^[a-zA-Z]+$"),
          message: "Accept only text"
        }
      ]
    },
    {
      type: "input",
      label: "Email Address",
      inputType: "email",
      name: "email",
     // _typename:"",
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Email Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern(
            "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"
          ),
          message: "Invalid email"
        }
      ]
    },
    {
      type: "input",
      label: "Password",
      inputType: "password",
      name: "password",
     // _typename:"",
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Password Required"
        }
      ]
    },
    {
      type: "radiobutton",
      label: "Gender",
      name: "gender",
      options: ["Male", "Female"],
      value: "Male",
      //_typename:""
    },
    // {
    // type: "date",
    // label: "DOB",
    // name: "dob",
    // validations: [
    // {
    // name: "required",
    // validator: Validators.required,
    // message: "Date of Birth Required"
    // }
    // ]
    // },
    {
      type: "select",
      label: "Country",
      name: "country",
      value: "UK",
      //_typename:"",
      options: ["India", "UAE", "UK", "US"]
    },
    {
      type: "checkbox",
      label: "Accept Terms",
      name: "term",
      value: "",
      //_typename:"",
      options: [true,false]
    },
    // {
    // type: "button",
    // label: "Save"
    // }
  ];

  isCommercial: any = false;
  isResidential: any = true;
  isMultiFamily: any = false;
  currentId: any = 1
  breadcrumbsList: any = [
    {
      title: "Profile",
      url: '/borrower/profile'
    },
    {
      title: 'Upload Property',
      url: '/borrower/profile/uploadproperty'
    },
  ]

  propertyType: Array<any> = []
  propertyFormQA: Array<FieldConfig> = []
  questionArray: Array<any> = [];
  showForm : Boolean = false;
  propertyInfo: FormGroup = new FormGroup({});

  constructor(private _borrowerService: BorrowerService,private router: Router,private toastr: ToastrService,
    private _formBuilder: FormBuilder,private _userService: UserService,private route: ActivatedRoute,private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getPropertyTypes();
    this.createForm();
  }

  createForm() {
    this.propertyInfo = this._formBuilder.group({
      propertyName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      address: [
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
      area: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(''),
        ],
      ],
      price: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
          Validators.pattern(''),
        ],
      ],
      propertyImages: [
        Validators.required,
      ],
    });
  }
  myFiles:string [] = [];
  sMsg:string = '';
  imagesArray: any = []
  fileName = "";
  showQuestionForm : boolean = false;

  getFileDetails (e) {
    //console.log (e.target.files);
    // for (var i = 0; i < e.target.files.length; i++) { 
    //   this.myFiles.push(e.target.files[i]);
    //   this.file = e.target.files[i];
    //   if(this.file){
    //     const fileName = this.file.name;
    //     // this.fileArray[i].fileName = fileName;
    //     this.fileArray[i].file = this.file;
    //   }

    // }
    // console.log(this.myFiles)
    if(e.target.files.length>6){
      this.toastr.error("Image limit should not exceed more than 6");
    }
    else{
      const formData = new FormData();
      for (var i = 0; i < e.target.files.length; i++) {
        const file: File  = e.target.files[i];
        if(file){
          this.fileName = file.name;
          formData.append("files", file, this.fileName);
        }
      }
      formData.append("propertyId", '');
      formData.append("fileType", "property_image_type");
      this._userService.uploadImageApiforProperty(formData).subscribe((res)=>{
        console.log(res);
        this.imagesArray=res;
      })
    }
    

  }

  uploadFiles() {
    console.log(this.propertyInfo.value);
    // this.fileArray.forEach((el, i) => {
    //   let formData = new FormData();
    //   el['file'] = formData.append('file', el.file);
    // })
    // const frmData = new FormData();
    
    // for (var i = 0; i < this.fileArray.length; i++) { 
    //   frmData.append("file",this.fileArray[i].file,this.fileArray[i].fileName);
    // }

    // console.log(frmData.get("file"),"formData");
    
    // this._userService.uploadImageApi(this.fileArray).subscribe((res)=>{
    //   console.log(res);
      
    // })
  }


  getPropertyTypes() {
    this._borrowerService.getAllPropertyTypes().subscribe((res: any) => {
      if (res?.data?.getAllPropertyTypes?.status == 200) {
        this.propertyType = res?.data?.getAllPropertyTypes?.data;
      }
      else {
        console.log("Error");
      }
    })
  }

  getPropertyTypeForm(propertyTypeId: any) {
    this.showForm = false;
    this._borrowerService.getAllFormByPropertyTypeId(propertyTypeId).then((res: any) => {
      console.log("Property Type Form",res);
      if (res?.data?.getAllFormByPropertyTypeId?.status == 200) {
        this.propertyFormQA = res?.data?.getAllFormByPropertyTypeId?.data;
        console.log("my ",this.propertyFormQA);
        this.showForm = true;
      }
      else {
        console.log("Error");
      }
    })
  }


  onSelectProperty(propertyTypeId: any) {
    console.log("Property Type Id is : ", propertyTypeId)
    this.currentId = propertyTypeId;
    this.getPropertyTypeForm(propertyTypeId);
  }

  submit(event : any) {
    console.log('Event',event);
    let propertyForm : Array<FieldConfig> = [];
    let tem : Array<FieldConfig> = [];
    //propertyForm = JSON.parse(JSON.stringify(this.propertyFormQA));
    propertyForm = JSON.parse(JSON.stringify(this.propertyFormQA), (key,value) =>{

      if (key === "__typename") {
        return undefined;
      }

      return value;
    });

    propertyForm.map((d:any,i:number) => {
     // console.log("propertyForm[i]['value']",event.value[d.name]);
     console.log(d);
     console.log(event.value);
      propertyForm[i]['value'] = event.value[d.name]//this line is sending it true
      console.log(propertyForm[i]);
      // propertyForm[i]['value']=d.name;
      console.log(propertyForm[i]['value']);
      if(propertyForm[i]['inputType']=="file"){
        propertyForm[i]['value']=localStorage.getItem('Urls');
      }
      
    })

    let borrowerId=localStorage.getItem("borrowerId");
    // this.propertyModel.borrowerId = "62d7cf4b07a224003a0d4dc1";
    this.propertyModel.borrowerId = borrowerId;
    this.propertyModel.propertyTypeId = this.propertyFormQA[0]['propertyTypeId'];
    this.propertyModel.description = "Here is the property descriptions with some details.";

    this.propertyModel.questions = propertyForm;

    // let property = {
    //   borrowerId: "62a86a4c3f2fa2775e721122",
    //   propertyTypeId: this.propertyFormQA[0]['propertyTypeId'],
    //   description: "Here is the property descriptions with some details.",
    //   questions : propertyForm
    // }
    console.log("Final",this.propertyModel);
    console.log(this.propertyInfo.value);
    // this.spinner.show();
    this._borrowerService.createProperty(this.propertyModel,this.propertyInfo.value,this.imagesArray).subscribe((res:any) => {
      this.spinner.hide();
     console.log('Create Property Response => ',res);
     if(res.data?.createProperty!=null){
      this.toastr.success("Property Created Successfully");
      setTimeout(()=>{
        this.router.navigate(['/borrower/profile']);
      }, 1000);
      localStorage.removeItem("Urls");
     }
     else{
      this.toastr.success("Error Occured");
     }
    },(err:any)=>{
      this.toastr.success(err);
      this.spinner.hide();
    })

  }
}
