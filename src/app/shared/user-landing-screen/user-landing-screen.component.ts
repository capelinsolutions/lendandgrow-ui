import { I, U } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/common/constants/app-constants';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { LenderService } from 'src/app/services/lender/lender.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-landing-screen',
  templateUrl: './user-landing-screen.component.html',
  styleUrls: ['./user-landing-screen.component.scss']
})
export class UserLandingScreenComponent implements OnInit {

  constructor(
    private _lenderService: LenderService,
    private _borrowerService: BorrowerService,
    private _authService: AuthServiceService,
    private _userService: UserService,
    private _router : Router
    ) { }

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  spinner = false;
  dashboardData: any = [];
  messageHistory: any = [];
  noChatFound: boolean = false;
  imageUrl : any;
  lenderDashboardData: any = [
    {
      id: 1,
      heading: "Contacted Borrowers",
      icon: "",
      total : 0
    },
    {
      id: 2,
      heading: "Successful Deals",
      icon: "",
      total : 0
    },
    {
      id: 3,
      heading: "Invested Amount",
      icon: "",
      total : 0
    }
  ]
  borrowerDashboardData: any = [
    {
      id: 1,
      heading: "Contacted Lenders",
      icon: "",
      total : 0
    },
    {
      id:2,
      heading: "Successful Deals",
      icon: "",
      total : 0
    },
    {
      id:3,
      heading: "No. of Properties",
      icon: "",
      total : 0
    }
  ]

  ngOnInit(): void {
    this.getUserRole();
  }
  
  getUserRole(){
    this.getUserMessageHistory();
    let roleId = localStorage.getItem("RoleId");
    this.spinner = true;
    if(roleId == AppConstants.BORROWER_ID){
      this.dashboardData = this.borrowerDashboardData;
      this._borrowerService.getContactedInvestor().subscribe((res:any) => {
        if(res.data.getTotalNoOfContactedInvestor != null){
          this.dashboardData[0].total = res?.data?.getTotalNoOfContactedInvestor?.data;
          // this._authService.setDashboardItems(this.dashboardData);
          this.spinner = false;
        }
      },(err:any)=>{
      })
      this._borrowerService.totalBorrowerProperties().subscribe((res:any)=>{
        if(res.data.getTotalNoOfPropertiesOfBorrower!=null){
          this.dashboardData[2].total = res?.data?.getTotalNoOfPropertiesOfBorrower?.data;
          this.spinner = false;
        }
      },
      (err:any)=>{
        console.log(err);
      })
    }
    else if (roleId == AppConstants.LENDER_ID){
      this.dashboardData=this.lenderDashboardData;
      this._lenderService.getContactedBorrower().subscribe((res:any)=>{
        if(res.data.getTotalNoOfContactedBorrower != null){
          this.dashboardData[0].total = res.data.getTotalNoOfContactedBorrower.data;
          this.spinner = false;
        }
      },
      (err:any)=>{
        console.log(err);
      })
    }
  }

  routeToChatScreen(recipientId:any,chatName:any){
    localStorage.setItem('chatName',chatName);
    let roleId = localStorage.getItem('RoleId');
    if(roleId == AppConstants.LENDER_ID){
      this._router.navigateByUrl(`/lender/borrower/list/${roleId}/chat/${recipientId}`)
    }
    else if(roleId == AppConstants.BORROWER_ID){
      this._router.navigateByUrl(`/borrower/lender/list/${roleId}/chat/${recipientId}`)
    }
  }

  getUserMessageHistory(){
    this._userService.getMessageHistory().subscribe((res:any)=>{
      console.log('History',res);
      if(res?.data?.getAllChatHistory != null){
        res?.data?.getAllChatHistory?.data?.chatHistory.forEach((element:any,i: number) => {
          if(i <= 2){
            this.messageHistory.push(element);
            this.noChatFound = false;
          }
        });
      }
      else{
        this.messageHistory = [];
        this.noChatFound = true;
      }
      
        // this.historyLength = res?.data?.getAllChatHistory?.data?.chatHistory.length;
        // if(res?.data?.getAllChatHistory != null){
        //   if(this.historyLength >= 3){
        //     for(let i=this.historyLength-3; i<this.historyLength; i++){
        //       this.messageHistory.push(res?.data?.getAllChatHistory.data.chatHistory[i]);
        //     }
        //   }
        //   else{
        //     for(let i=0;i<this.historyLength;i++){
        //       this.messageHistory.push(res?.data?.getAllChatHistory.data.chatHistory[i]);
        //     }
        //   }
        // }
        // else if(res?.data?.getAllChatHistory==null){
        //   this.messageHistory=null;
        // }
    })
  }

  getImage(url : string){
    this._userService.getImage(url).subscribe({
      next : (response : any) => {
        console.log('Image Response',response);
        return response
      },
      error : (error : any) => {
        console.log('Error',error);
      }
    })
  }
}