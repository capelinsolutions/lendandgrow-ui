import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { UserService } from 'src/app/services/user/user.service';
import { ShareDocumentComponent } from '../share-document/share-document.component';

@Component({
  selector: 'app-share-file-modal',
  templateUrl: './share-file-modal.component.html',
  styleUrls: ['./share-file-modal.component.scss']
})
export class ShareFileModalComponent implements OnInit {

  dataSourceDocuments: any = [];
  stepperOrientation: Observable<StepperOrientation>;
  dataSourceFolders: any = [];
  questions: any = []
  documentQuestions: any = []
  valueName: any = []
  fileName = ""
  documentAccess: any = []
  selected = -1;
  // valueName : String[][];
  docLinks: any = []
  imagesArray: any = []
  folderName: any
  folderId: string = '';
  accessTypeRead="read";
  accessTypeDownload="Download";
  // read: boolean[] = [];
  // write: boolean[] = [];
  readChecked: any = true
  writeChecked: any = true
  constructor(  private _formBuilder: FormBuilder,
  private dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any, 
  private activatedRoute: ActivatedRoute,
  private _changeDetector: ChangeDetectorRef,
  private _borrowerService: BorrowerService,
  breakpointObserver: BreakpointObserver,
  private _userService: UserService) { 
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 900px)')
    .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  documentInfo = this._formBuilder.group({
    pdfDocuments: this._formBuilder.array([]),
  })
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.folderId = params.get('folderId');
    });
    this.getSinglePropertyDocuments();
  }
  close() {
    this.dialog.closeAll();
  }
   /*checkbox change event*/
   onChange(event,document,accessType) {
    // console.log(event,"Event is")
    // console.log(document,"Document is");
    // console.log(accessType,"Access Type");
    let link=""
    for(let i=0;i<this.docLinks.length;i++){
      // console.log(this.docLinks[i],"DocLinks");
      if(this.docLinks[i].includes(document)){
        link=this.docLinks[i];
        // console.log(link,"Link");
      }
    }
    if(event.checked==true){
      if(this.documentAccess.length>0){
        for(let i=0;i<this.documentAccess.length;i++){
          if(this.documentAccess[i].documentUrl==link){
            this.documentAccess[i].accessType.push(accessType);
            break;
          }
          else if(i==this.documentAccess.length-1){
            this.documentAccess.push({documentUrl: link,accessType: [accessType]})
            break;
          }
        }
      }
      else{
        this.documentAccess.push({documentUrl: link,accessType: [accessType]})
      }
      
    }
    else if(event.checked==false){
      for(let i=0;i<this.documentAccess.length;i++){
        if(this.documentAccess[i].documentUrl==link){
          let index=this.documentAccess[i].accessType.indexOf(accessType);
          this.documentAccess[i].accessType.splice(index,1);
          if(this.documentAccess[i].accessType.length==0){
            this.documentAccess.splice(i,1);
          }
          break;
        }
      }
    }
    // console.log(this.documentAccess,"Document Access Object");
    
  }
  onClickDocument(e){
    // console.log(e,"Event is");
    let data=e.option._value;
    const checkArray: FormArray = this.documentInfo.get('pdfDocuments') as FormArray;
    let arr: Array<any> = this.documentInfo.get('pdfDocuments').value;
    if(e.option.selected==true){
      let link = "";
      for(let i=0;i<this.docLinks.length;i++){
      // console.log(this.docLinks[i],"DocLinks");
      if(this.docLinks[i].includes(data)){
        link=this.docLinks[i];
        // console.log(link,"Link");
        if (arr.includes(link)) {
          return;
        }
        else {
          checkArray.push(new FormControl(link));
        }
      }
    }
    }
    else if(e.option.selected==false){
      let link = "";
      for(let i=0;i<this.docLinks.length;i++){
      // console.log(this.docLinks[i],"DocLinks");
      if(this.docLinks[i].includes(data)){
        link=this.docLinks[i];
        // console.log(link,"Link");
        var ind = 0;
        if (arr.includes(link)) {
          checkArray.controls.forEach((item: any,index: any) => {
            if(item.value==link){
              checkArray.removeAt(ind);
            }
            ind++;
          });
          return;
        }
      }
    }
    }
  }

  getSinglePropertyDocuments(){
    this._borrowerService.getPropertyById(this.data).subscribe((res:any)=>{
      this.folderName=res.data.getPropertyById.data.title;
      this.questions=res.data.getPropertyById.data.questions;
      this.questions.map((p:any,i:any)=>{
        if(this.questions[i]['inputType']=="file"){
          this.documentQuestions.push(this.questions[i]);
        }
      })
      // console.log(this.documentQuestions,"Questions");
      this.dataSourceDocuments=this.documentQuestions;
      this.dataSourceDocuments.map((d:any,i:any)=>{
        // console.log(d,"Questions");
        this.docLinks=d.value.split(",");
        // console.log(this.docLinks,"docs");
            for(let i=0;i<this.docLinks.length;i++){;
              let name = this.docLinks[i].split("=");
              // console.log(this.docLinks[i],"Single Doc");
              let nameValue = name[1].split("&");
              if(nameValue[0].length>30){
                this.valueName[i]=nameValue[0].substring(nameValue[0].length-25,nameValue[0].length);
              }
              else{
                this.valueName[i]=nameValue[0].substring(13,nameValue[0].length);
              }
              // this.valueName[i]=nameValue[0];
              // console.log(this.valueName,"Value");
            }
      })
      
    })
  }

  openShareFolderModal(data){
    // console.log(data,"Data coming to shared ");
    
    this.dialog.open(ShareDocumentComponent,{
      minWidth: '400px',
      data: data
    });
  }

  onSubmit(){
    const checkArray: FormArray = this.documentInfo.get('pdfDocuments') as FormArray;
    // console.log(checkArray, "control items");
    // console.log(this.documentInfo.value.pdfDocuments,"Document Value");
    

    // checkArray.clear();
    // let data = [];
    let passData={propertyId: this.data,documentAccess: this.documentAccess}
    // data.push(this.data);
    // data.push({Urls: this.documentInfo.value.pdfDocuments})
    // data.push({propertyId: this.data,Urls: this.documentInfo.value.pdfDocuments });
    this.openShareFolderModal(passData);
  }

}
