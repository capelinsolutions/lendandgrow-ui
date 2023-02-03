import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import cloneDeep from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit-shared-file-modal',
  templateUrl: './edit-shared-file-modal.component.html',
  styleUrls: ['./edit-shared-file-modal.component.css']
})
export class EditSharedFileModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _borrowerService: BorrowerService,
   private _formBuilder: FormBuilder,private _toast: ToastrService, private dialog: MatDialog,
   private _changeDetector: ChangeDetectorRef,
   private spinner: NgxSpinnerService
   ) { }

  indexExpanded: number = -1;
  panelOpenState: boolean = false;
  isExpanded: boolean = false;
  readChecked: any = true
  writeChecked: any = true
  accessTypeRead="read";
  accessTypeDownload="Download";
  propertyData: any = []
  emailsDocumentAccess: any = [];
  documentAccess: any = []
  documentInfo = this._formBuilder.group({
    pdfDocuments: this._formBuilder.array([]),
  })
  step = -1;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  ngOnInit(): void {
    this.getSharedAccessData()
  }
  ngAfterViewInit() {
    this._changeDetector.detectChanges();
  }
  onExpand(i){
    this.panelOpenState[i]=true;
  }
  onCollapse(i){
    this.panelOpenState[i]=false;
  }
  beforePanelClosed(panel){
    console.log(panel);
    
    panel = false;
    console.log("Panel going to close!");
  }
  beforePanelOpened(panel){
    console.log(panel);
    panel = true;
    console.log("Panel going to  open!");
  }
  afterPanelClosed(e){
    console.log("Panel closed!");
    console.log(e,"event");
    
  }
  afterPanelOpened(e){
    console.log(e,"Event");
    
    console.log("Panel opened!");
  }

  close() {
    this.dialog.closeAll();;
  }

  getSharedAccessData(){
    this._borrowerService.getSharedFileDataByPropertyId(this.data).subscribe((res:any)=>{
      console.log(res,"shared data");
      if(res.data.getSharedFileByPropertyId!=null){
        this.propertyData=res.data.getSharedFileByPropertyId.data;
        this.emailsDocumentAccess = this.propertyData.emailsDocumentAccess;
        for(let i=0;i<this.emailsDocumentAccess.length;i++){
          this.documentAccess[i]=this.emailsDocumentAccess[i].documentAccess;
        }
        console.log(this.documentAccess);
      }
      else{
        this._toast.error("No Files Shared");
        this.dialog.closeAll();
      }
      
    })
  }

  removerUserClick(shareDocument){
    console.log(shareDocument,"share doc");
    this.emailsDocumentAccess=this.emailsDocumentAccess.filter((x:any)=>x.email!=shareDocument.email);
    console.log(this.emailsDocumentAccess);
    
  }

  onChangeCheckbox(event,accessType,i,j,l){
    
    if(event.checked == true){
      if(this.emailsDocumentAccess[i].documentAccess[j].accessType[0] == "Download"){
        this.emailsDocumentAccess[i].documentAccess[j].accessType.splice(0,accessType);
        console.log(this.emailsDocumentAccess,"Emails doc access");
      }
      else{
        this.emailsDocumentAccess[i].documentAccess[j].accessType.push(accessType);
        console.log(this.emailsDocumentAccess[i].documentAccess[j].accessType,"After pushing");
        console.log(this.emailsDocumentAccess,"Emails doc access");
      }
    }
    else if(event.checked==false){
      if(this.emailsDocumentAccess[i].documentAccess[j].accessType.length==1){
        let arrayForSort = [...this.emailsDocumentAccess[i].documentAccess]
          let emailsArr=[...this.emailsDocumentAccess]
          console.log(arrayForSort);
          let temp = { ...arrayForSort[j] };
          let accessArr = cloneDeep([...this.emailsDocumentAccess[i].documentAccess[j].accessType]);
          console.log(accessArr.__wrapped__.splice(l,1));
          temp.accessType=accessArr.__wrapped__;
          arrayForSort[j]=temp;
          console.log(arrayForSort,"arr");
          let t={...emailsArr[i]};
          t.documentAccess=arrayForSort;
          emailsArr[i]=t;
          console.log(emailsArr);
          this.emailsDocumentAccess=emailsArr;
        // if(this.emailsDocumentAccess[i].documentAccess[j].accessType.length==0){
        //   this.emailsDocumentAccess[i].documentAccess.splice(j,1);
        //   this.emailsDocumentAccess=this.emailsDocumentAccess.filter((x:any)=>x.documentAccess.length!=0);
        // }
        console.log(this.emailsDocumentAccess);
      }
      else{
        if(this.emailsDocumentAccess[i].documentAccess[j].accessType[0]=="Download"){
          this.emailsDocumentAccess[i].documentAccess[j].accessType.splice(0,accessType);
        }
        else{
          let arrayForSort = [...this.emailsDocumentAccess[i].documentAccess]
          let emailsArr=[...this.emailsDocumentAccess]
          console.log(arrayForSort);
          let temp = { ...arrayForSort[j] };
          let accessArr = cloneDeep([...this.emailsDocumentAccess[i].documentAccess[j].accessType]);
          console.log(accessArr.__wrapped__.splice(l,1));
          temp.accessType=accessArr.__wrapped__;
          arrayForSort[j]=temp;
          console.log(arrayForSort,"arr");
          let t={...emailsArr[i]};
          t.documentAccess=arrayForSort;
          emailsArr[i]=t;
          console.log(emailsArr);
          this.emailsDocumentAccess=emailsArr;
          console.log(this.emailsDocumentAccess,"Emails doc access");
        }
      }
      
      
    }
  }

  onUpdate(){
    console.log(this.emailsDocumentAccess,"Data on Submit");
    this.spinner.show();
    if(this.emailsDocumentAccess.length>1){
      for(let i=0;i<this.emailsDocumentAccess.length;i++){
        for(let j=0;j<this.emailsDocumentAccess[i].documentAccess.length;j++){
          if (this.emailsDocumentAccess[i].documentAccess[j].accessType.length == 0) {
            this.emailsDocumentAccess[i].documentAccess.splice(j,1);
            this.emailsDocumentAccess = this.emailsDocumentAccess.filter((x: any) => x.documentAccess.length != 0);
          }
        }
      }
    }
    let docData={sharedFileId: this.propertyData.sharedFileId,propertyId: this.propertyData.property.propertyId,emailsDocumentAccess:this.emailsDocumentAccess}
    console.log("Data made",docData);
    let emailAccessData=JSON.parse(JSON.stringify(docData), (key,value) =>{
      if (key === "__typename") {
        return undefined;
      }

      return value;
    });
    
    
    this._borrowerService.updateSharedFileData(emailAccessData).subscribe((res:any)=>{
      if(res.data!=null){
        if(res.data.updateSharedFile!=null){
          this.spinner.hide();
          this._toast.success("Document Updated Successfully");
          this.dialog.closeAll();
        }
        else{
          this.spinner.hide();
          this._toast.error("Error occured in updating document");
        }
      }
      else{
        this.spinner.hide();
        this._toast.error("Error occured in updating document");
      }
    })
  }

}
