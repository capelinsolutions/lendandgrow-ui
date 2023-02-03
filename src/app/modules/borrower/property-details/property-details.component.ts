import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from 'src/app/common/constants/app-constants';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { PdfViewerModalComponent } from '../pdf-viewer-modal/pdf-viewer-modal.component';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {

  constructor(
    private _borrowerService: BorrowerService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _toast: ToastrService
    ) { }

  propertyData: any = [];
  dataSourceDocuments: any = [];
  questions: any = [];
  documentQuestions: any = [];
  valueName: any = [];
  fileName = "";
  docLinks: Array<any> = [];
  folderName: any;
  Investor: any = false;
  Borrower: any = false;
  emailsDocumentAccess: any = [];
  documentAccess: Array<any> = [];
  propertyId: any;
  imageUrls: any = [];
  breadcrumbsList:any = [
    {
      title: 'Profile',
      url:'/borrower/profile'
    },
    {
      title: 'Property',
      url:'/borrower/profile/property/:id'
    },
  ]
  lenderCrumbs: any = [
    {
      title: 'Borrower Profile',
      url:'/lender/borrower/list/:id'
    },
    {
      title: 'Property',
      url:'/lender/borrower/list/:id/property/:id'
    },
  ]

  ngOnInit(): void {
    this.getPropertyId();
    this.setBreadCrumbs();
  }

  setBreadCrumbs(){
    let roleId = localStorage.getItem("RoleId");
    if(roleId == AppConstants.LENDER_ID){
      this.breadcrumbsList = this.lenderCrumbs;
    }
  }

  getPropertyId(){
    this.route.params.subscribe(res => {
      this.propertyId = res.id;
      this.getPropertDetails(this.propertyId);
    });
  }

  getPropertDetails(propertyId: any){
    if(localStorage.getItem("RoleId") == AppConstants.BORROWER_ID){
      this.Borrower = true;
      this._borrowerService.getPropertyById(propertyId).subscribe((res:any) => {
        if(res?.data?.getPropertyById != null){                    
          this.propertyData = res?.data?.getPropertyById.data;
          console.log('Property Details',this.propertyData);
          this.imageUrls = this.propertyData.imageUrls;
          this.folderName = res?.data?.getPropertyById.data.title;
          this.questions = res?.data?.getPropertyById.data.questions;
          this.questions.map((p:any,i:any) => {
            if(this.questions[i]['inputType'] == "file"){
              this.documentQuestions.push(this.questions[i]);
            }
          })
          this.dataSourceDocuments = this.documentQuestions;
          this.dataSourceDocuments.map((d:any,i:any)=>{
            this.docLinks = d.value.split(",");
            this.docLinks=this.docLinks.reverse();
          })
        }
        else if(res?.data?.getPropertyById == null){
          if(res?.errors[0]?.message){
            this._toast.error(res?.errors[0]?.message);
          }
        }
      })
    }
    else if(localStorage.getItem("RoleId") == AppConstants.LENDER_ID){
      this.Investor = true;
      this._borrowerService.getPropertyById(this.propertyId).subscribe((res:any)=>{
        if(res?.data?.getPropertyById != null){
          this.propertyData = res?.data?.getPropertyById.data;
          this.imageUrls = this.propertyData.imageUrls;
        }
        else if(res?.data?.getPropertyById == null){
          if(res?.errors[0]?.message){
            this._toast.error(res?.errors[0]?.message);
          }
        }
      })
        this._borrowerService.getBorrowerDocumentsForInvestor(this.propertyId).subscribe((res:any)=>{
        if(res?.data?.getSharedFileByInvestorEmailAndPropertyId != null){
          console.log(res?.data?.getSharedFileByInvestorEmailAndPropertyId,"DocAccess");

          res?.data?.getSharedFileByInvestorEmailAndPropertyId?.data?.emailsDocumentAccess.forEach((element: any) => {
            this.emailsDocumentAccess= element.documentAccess;
          });;
          console.log(this.emailsDocumentAccess,"DocAccess");
        }
        else if(res?.data?.getSharedFileByInvestorEmailAndPropertyId == null ){
          this.emailsDocumentAccess = [];
        }
        })
    }
  }

  openShareDocumentModal(data) {    
    let link = "";
    if(this.Borrower){
      for(let i=0;i<this.docLinks.length;i++){
        if(this.docLinks[i].includes(data)){
          link=this.docLinks[i];
          let Url = [];
          Url.push(link)
          let passData={propertyId: this.propertyId,Urls: Url}
          this.dialog.open(PdfViewerModalComponent,{
            minWidth: '400px',
            data: passData
          });
        }
        
      }
    }
    else{
      let passData={role: this.Investor,Url: data}
      this.dialog.open(PdfViewerModalComponent,{
        minWidth: '400px',
        data: passData
      });
    }
    
  }
  onClickDocument(e){
    console.log(e,"Event is");
      this.openShareDocumentModal(e.option._value);
      e.option.selected=false;
  }

}