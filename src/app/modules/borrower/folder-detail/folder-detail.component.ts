import { ShareFolderComponent } from './../share-folder/share-folder.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { merge, of, Observable } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { setInterval } from 'timers';
import { PdfViewerModalComponent } from '../pdf-viewer-modal/pdf-viewer-modal.component';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { UserService } from 'src/app/services/user/user.service';
import { ShareFileModalComponent } from '../share-file-modal/share-file-modal.component';
import { EditSharedFileModalComponent } from '../edit-shared-file-modal/edit-shared-file-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpConstants } from 'src/app/common/constants/http.constants';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.scss'],
})
export class FolderDetailComponent implements OnInit {
  folderId: string = '';
  breadcrumbsList: any = [
    {
      title: 'My Documents',
      url: '/borrower/documents',
    },
    {
      title: this.folderId,
      url: `/folder/${this.folderId}`,
    },
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  documentsList: any = [];
  dataSourceDocuments: any = [];
  dataSourceFolders: any = [];
  questions: any = []
  documentQuestions: any = []
  valueName: any = []
  fileName = ""
  // valueName : String[][];
  docLinks: Array<any> = []
  imagesArray: any = []
  folderName: any
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private _borrowerService: BorrowerService,
    private _userService: UserService,
    private spinner: NgxSpinnerService,private _toast: ToastrService,
    private _httpConstants: HttpConstants
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.folderId = params.get('folderId');
    });
    
  }

  ngAfterViewInit() {
    this.linkListToPaginator();
    this._changeDetector.detectChanges();
  }

  linkListToPaginator() {
    this.getSinglePropertyDocuments();
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return of(this.documentsList);
        })
      )
      .subscribe((res: any) => {
        const from = this.paginator.pageIndex * this.pageSize;
        const to = from + this.pageSize;
        this.dataSourceDocuments = res.slice(from, to);
      });
  }
  search() {}
  uploadDocument(e) {
    const formData = new FormData();
    for (var i = 0; i < e.target.files.length; i++) {
      const file: File  = e.target.files[i];
      if(file){
        this.fileName = file.name;
        formData.append("files", file, this.fileName);
      }
    }
    formData.append("propertyId", this.folderId);
    formData.append("fileType", "property_file_type");
    this._userService.uploadImageApiforProperty(formData).subscribe((res)=>{
      console.log(res);
      this.spinner.show();
      if(res!=null){
        this.imagesArray=res;
        this.getSinglePropertyDocuments();
        this._changeDetector.detectChanges();
        setTimeout(()=>{
          this.spinner.hide();
          this._toast.success("Document uploaded successfully");
        }, 1000);
        
      }
      else{
        this.spinner.hide();
      }
      
    },
    (err) => {
      if(err.status==this._httpConstants.REQUEST_STATUS.REQUEST_NOT_FOUND_404.CODE){
        this.spinner.hide();
        this._toast.error(this._httpConstants.REQUEST_STATUS.REQUEST_NOT_FOUND_404.MESSAGE);
        this.dialog.closeAll();
      }
      else if(err.status==this._httpConstants.REQUEST_STATUS.UNAUTHORIZED_401.CODE){
        this.spinner.hide();
        this._toast.error(this._httpConstants.REQUEST_STATUS.UNAUTHORIZED_401.MESSAGE);
        this.dialog.closeAll();
      }
      else if(err.status==this._httpConstants.REQUEST_STATUS.SERVER_ERROR_500.CODE){
        this.spinner.hide();
        this._toast.error(this._httpConstants.REQUEST_STATUS.SERVER_ERROR_500.MESSAGE);
        this.dialog.closeAll();
      }
    }
    )
    
  }
  handlePage(e) {
    this.pageSize = e.pageSize;
  }

  openShareFolderModal() {
    this.dialog.open(ShareFolderComponent,{
      minWidth: '400px'
    });
  }

  openShareDocumentModal(data) {
    let link = "";
    
    for(let i=0;i<this.docLinks.length;i++){
      if(this.docLinks[i].includes(data)){
        link=this.docLinks[i];
        let Url = [];
        Url.push(link)
        let passData={propertyId: this.folderId,Urls: Url}
        this.dialog.open(PdfViewerModalComponent,{
          minWidth: '400px',
          data: passData
        });
      }
      
    }
  }
  onClickDocument(e){
      this.openShareDocumentModal(e.option._value);
      e.option.selected=false;
  }
  onClickEditDocument(){
    this.dialog.open(EditSharedFileModalComponent,{
      width: '900px',
      maxWidth: '900px',
      height: '60%',
      autoFocus: false,
      data: this.folderId
    });
  }
  onClickShare(){
    this.dialog.open(ShareFileModalComponent,{
      width: '750px',
      maxWidth: '900px',
      height: '70%',
      autoFocus: false,
      data: this.folderId
    });
  }
  getSinglePropertyDocuments(){
    this._borrowerService.getPropertyById(this.folderId).subscribe((res:any)=>{
      if(res?.data?.getPropertyById!=null){
        this.folderName=res?.data?.getPropertyById?.data.title;
        this.questions=res?.data?.getPropertyById?.data.questions;
        this.questions.map((p:any,i:any)=>{
          if(this.questions[i]['inputType']=="file" /*&& this.questions[i]['label']=="Property Document(s)"*/){
            this.documentQuestions.push(this.questions[i]);
          }
        })
        this.dataSourceDocuments=this.documentQuestions;
        this.dataSourceDocuments.map((d:any,i:any)=>{
          this.docLinks=d.value.split(",");
        })
        this.docLinks=this.docLinks.reverse();
      }
      else if(res?.data?.getPropertyById==null){
        if(res?.errors[0]?.message){
          this._toast.error(res?.errors[0]?.message);
        }
      }
    })
  }
}