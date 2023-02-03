import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Borrower } from 'src/app/common/models/borrowerProfile';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { CompleteProfileComponent } from '../complete-profile/complete-profile.component';
@Component({
  selector: 'app-borrower-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  borrowerProfile : Borrower = new Borrower();
  propertyList: any = [
    {
      id: 1,
      name: 'Muhammad Haad',
      price: '300'
    },
    {
      id: 12,
      name: 'Muhammad Qasim',
      price: '300'
    },
    {
      id: 13,
      name: 'Muhammad Junaid',
      price: '600'
    },
  ]

  borrowerPropertyList: any = []
  sortedList: any = []
  breadcrumbsList:any = [
    {
      title: 'Profile',
      url:'/borrower/profile'
    },
  ]
  file : any
  imageURL: any
  constructor(
    private _dialog: MatDialog,
    private _borrowerservice: BorrowerService,
    private _authService: AuthServiceService,
    private spinner: NgxSpinnerService,private _toast: ToastrService
  ) 
  {
  }
  
  ngOnInit(): void {
    this.getBorrowerById();
    this.getAllBorrowerProperties();
    
  }


getAllBorrowerProperties(){
  this._borrowerservice.getAllPropertyTypesForLoggedInUser().subscribe((res:any)=>{
    if(res?.data?.getAllPropertyForLoggedInUser!=null){
      this.borrowerPropertyList=res?.data?.getAllPropertyForLoggedInUser.data;
    }
    if(this.borrowerPropertyList.length>1 && this.borrowerPropertyList.length==3){
      for(let i=0;i<3;i++){
        this.sortedList.push(this.borrowerPropertyList[i])
      }
    }else if(this.borrowerPropertyList.length>3){
      for(let i=0;i<3;i++){
        this.sortedList.push(this.borrowerPropertyList[i])
      }
    }
    else if(this.borrowerPropertyList.length<3){
      for(let i=0;i<this.borrowerPropertyList.length;i++){
        this.sortedList.push(this.borrowerPropertyList[i])
      }
    }
    
    
  },(err:any)=>{
    // this._toast.error(err);
    
  })
}

  onFileSelected(event){
    if (event.target.files.length > 0) {
      this.file = <File> event.target.files[0];
      const formData = new FormData();
      formData.append('file',this.file,this.file.filename);
      formData.append('propertyTypeId',null);
      this._borrowerservice.saveBorrowerImage(formData).subscribe((res:any) => {
        this.imageURL=res.data
        let profileData={...this.borrowerProfile}
        profileData.profileImageURL=this.imageURL;
        this.borrowerProfile=profileData;
        this._authService.setProfileImage(this.imageURL);
      },(err:any)=>{
        this._toast.error(err);
      })
    }   
  }

  openBorrowerEditProfileDialog() {
    const dialogRef = this._dialog.open(CompleteProfileComponent, {
      width: '700px',
      maxWidth: '700px',
      height: '70%',
      autoFocus: false,
      data : this.borrowerProfile
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      
      if((result?.imageUrl!="" || result?.imageUrl!=null || result?.imageUrl!=undefined || result?.imageUrl) && result!=undefined ){
        this.imageURL = result.imageUrl;
        const new_obj = { ...this.borrowerProfile, profileImageURL: this.imageURL }
        this.borrowerProfile = new_obj;
        this._authService.setProfileImage(this.imageURL);
      }
      // console.log(result.data.data.updateBorrower.data,"Data coming from complete profile component");
      if(result?.data?.data){
        this.borrowerProfile=result.data.data.updateBorrower.data;
      }
    });
  }


  getBorrowerById(){
    this._borrowerservice.getSingleBorrower().subscribe((res: any) => {
      this.borrowerProfile = res.data.getBorrower.data;
      this._authService.setUserData(this.borrowerProfile);
      this.imageURL = this.borrowerProfile.profileImageURL
      this._authService.setProfileImage(this.imageURL);
      this._authService.$profileImage.subscribe((res)=>{
        console.log(res);
      })
    },(err:any)=>{
      this._toast.error(err);
    });
  }

  
}
