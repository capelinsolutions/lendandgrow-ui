import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { LenderService } from 'src/app/services/lender/lender.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-lender-details',
  templateUrl: './lender-details.component.html',
  styleUrls: ['./lender-details.component.scss']
})
export class LenderDetailsComponent implements OnInit {

  
  breadcrumbsList:any = [
    
    {
      title: 'Lender List',
      url:'/borrower/lender/list'
    },
    
    {
      title: 'Lender',
      url:'/borrower/lender/list/:id'
    }
  ]

  id: any = "chat"
  investorId: any;
  feeStructure: any;
  questionsAndPropertyData: any = []
  selectedPropertyandQuestions: any = []
  constructor(private route: ActivatedRoute,private investorService: LenderService,private _userService: UserService,
    private _lenderService: LenderService,private _toast: ToastrService) { 
    this.route.params.subscribe(res => {
      // console.log("Investor ID",res.id)
      this.investorId=res.id;
    });
    this.getInvestor();
  }

  ngOnInit(): void {
    
  }
  data: any = [];
  data2: any = [];
  imageURL: any

  getSelectedPropertyAndQuestions(idsArr){
    console.log(idsArr,"Ids");
    this._lenderService.getAllFormsBySelectedInvestorQuestionsIds(idsArr).subscribe((res: any)=>{
      console.log(res,"question data");
      if(res?.data!=null || res?.data?.getFormsByListOfForms!=null){
        this.selectedPropertyandQuestions = res.data.getFormsByListOfForms.data;
      }
    })
  }

  getInvestor(){
    this.investorService.getInvestorById(this.investorId).subscribe((res: any)=>{
      this.getSelectedPropertyAndQuestions(res?.data?.getInvestorById?.data.questions);
      this.investorService.getFeeStructureById(res?.data?.getInvestorById?.data.feeStructureId).subscribe((res:any)=>{
        this.feeStructure = res?.data?.getFeeStructure?.data.text;
      })
      if(res?.data?.getInvestorById.status==200){
        this.data=res?.data?.getInvestorById?.data;
        this.imageURL = res?.data?.getInvestorById?.data.profileImageURL;
        localStorage.setItem('chatName',this.data?.name);
      }
      if(res?.data?.getInvestorById==null){
        if(res?.errors[0]?.message){
          this._toast.error(res?.errors[0]?.message);
        }
      }
    });
}
}