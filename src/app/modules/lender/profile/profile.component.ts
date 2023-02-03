import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { LenderService } from 'src/app/services/lender/lender.service';
import { CompleteProfileComponent } from '../complete-profile/complete-profile.component';
@Component({
  selector: 'app-lender-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  imageURL = "";
  lenderData: any = [];
  buttonName: any;
  feeStructure: any;
  questionsAndPropertyData: Array<any> = [];
  selectedPropertyandQuestions: Array<any> = []
  breadcrumbsList: any = [
    {
      title: 'Lender Profile',
      url: '/lender/profile'
    },
  ]

  constructor(
    private dialog: MatDialog,
    private _lendorService: LenderService,
    private _authService: AuthServiceService,
    private _toast: ToastrService
    ) { }

  ngOnInit(): void {
    this.getInvestor();
  }

  open(){
    const dialogRef = this.dialog.open(CompleteProfileComponent, {
      width: '700px',
      maxWidth: '700px',
      height: '70%',
      autoFocus: false,
      data: this.lenderData
    });

    dialogRef.afterClosed().subscribe(result => {

      if((result?.imageUrl!="" || result?.imageUrl != null || result?.imageUrl != undefined || result?.imageUrl) && result!=undefined){

        this.imageURL = result.imageUrl;
        const new_obj = { ...this.lenderData, profileImageURL: this.imageURL }
        this.lenderData = new_obj;
        this._authService.setUserData(this.lenderData);
        this._authService.setProfileImage(this.imageURL);
      }

      if(result?.data?.data){
        this.lenderData = result.data.data.updateInvestor.data;
        this.getInvestor();
      }
    },
    (err:any)=>{
      this._toast.error(err);
    });
  }

  getSelectedPropertyAndQuestions(questionIds: any){
    console.log(questionIds,"Ids");
    this._lendorService.getAllFormsBySelectedInvestorQuestionsIds(questionIds).subscribe((res: any)=>{      
      if(res?.data != null || res?.data?.getFormsByListOfForms != null){
        this.selectedPropertyandQuestions = res?.data?.getFormsByListOfForms?.data;
      }
    })
  }

  getInvestor() {
    this.lenderData = [];
    this._lendorService.getSingleInvestor().subscribe((res: any) => {
      console.log("Data is ", res);
      const isNullish = Object.values(res).some(val =>{
        if(val === null){
          return true
        }
        return false
      })
      
      this.lenderData = res?.data?.getInvestor.data;
      this.getSelectedPropertyAndQuestions(this.lenderData.questions);

      this._lendorService.getFeeStructureById(this.lenderData.feeStructureId).subscribe((res:any)=>{
        console.log(res);
        if(res?.data!=null){
          this.feeStructure = res?.data?.getFeeStructure?.data?.text;
        }
        
      })
      
      if (this.lenderData.profileImageURL != null || this.lenderData.profileImageURL != "") {
        this.imageURL = this.lenderData.profileImageURL;
      }
      console.log("Single lender", this.lenderData)
      if(isNullish){
        this.buttonName="Complete Profile"
      }
      else{
        this.buttonName="Edit Profile"
      }
      // this.getSelectedPropertyAndQuestions(this.lenderData.questions);
    })
  }
}
