import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';
import { ShareDocumentComponent } from '../share-document/share-document.component';
import { HttpConstants } from '../../../common/constants/http.constants';
@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.scss']
})
export class PdfViewerModalComponent implements OnInit {


  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _userService: UserService, private spinner: NgxSpinnerService, private _toast: ToastrService,
    private _httpConstants: HttpConstants
  ) { }

  ngOnInit(): void {
    console.log(this.data, "Data coming from folder component");
    this.getDoc();
  }

  pdfSrc = "";

  openShareFolderModal() {
    this.dialog.open(ShareDocumentComponent, {
      minWidth: '400px',
      data: this.data
    });
  }

  onClickDocument(e) {
    this.openShareFolderModal();
  }

  close() {
    this.dialog.closeAll();
  }
  downloadPdf() {
    if (this.data?.Url) {
      console.log('User is Investor');
      if(this.data?.Url?.accessType[1]=="Download")
      {
        this._userService.getImage(this.data.Url.documentUrl).subscribe((res: any) => {
          this.spinner.hide();
          const a = document.createElement('a');
          document.body.appendChild(a);
          let blob = new Blob([res], { type: 'application/pdf' });
          var url = window.URL.createObjectURL(blob);
          a.href = url;
          let data=this.data.Url.documentUrl.split('=')[1].split('&')[0];
          a.download = data + '.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },(err: any)=>{
          this._toast.error(err.error.message);
          this.spinner.hide();
        })
      }
      else{
        this._toast.error("Access denied");
      }
      
      
    }
    else if(this.data?.Urls){
      console.log('User is borrower');
      this._userService.getImage(this.data.Urls[0]).subscribe((res: any) => {
        this.spinner.hide();
        const a = document.createElement('a');
        document.body.appendChild(a);
        let blob = new Blob([res], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(blob);
        let data=this.data.Urls[0].split('=')[1].split('&')[0];
        a.href = url;
        a.download = data + '.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },(err: any)=>{
        this._toast.error(err.error.message);
        this.spinner.hide();
      })
    }
  }

  getDoc() {
    this.spinner.show();
    if (this.data?.role) {
      //for invester with whom document is shared
      this._userService.getImage(this.data.Url.documentUrl).subscribe((res: any) => {
        this.spinner.hide();
        let blob = new Blob([res], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(blob);
        this.pdfSrc = url;
      },
        (err) => {
          // if(err.status==this._httpConstants.REQUEST_STATUS.REQUEST_NOT_FOUND_404.CODE){
          //   this.spinner.hide();
          //   this._toast.error(this._httpConstants.REQUEST_STATUS.REQUEST_NOT_FOUND_404.MESSAGE);
          //   this.dialog.closeAll();
          // }
          // else if(err.status==this._httpConstants.REQUEST_STATUS.UNAUTHORIZED_401.CODE){
          //   this.spinner.hide();
          //   this._toast.error(this._httpConstants.REQUEST_STATUS.UNAUTHORIZED_401.MESSAGE);
          //   this.dialog.closeAll();
          // }
          console.log(err);

          this.spinner.hide();
          this._toast.error(err.message);
          this.dialog.closeAll();
        }
      )
    }
    else {
      //for borrower
      this._userService.getImage(this.data.Urls[0]).subscribe((res: any) => {
        this.spinner.hide();
        let blob = new Blob([res], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(blob);
        this.pdfSrc = url;
      },
        (err) => {
          // if(err.status==this._httpConstants.REQUEST_STATUS.REQUEST_NOT_FOUND_404.CODE){
          //   this._toast.error(this._httpConstants.REQUEST_STATUS.REQUEST_NOT_FOUND_404.MESSAGE);
          // }
          // else if(err.status==this._httpConstants.REQUEST_STATUS.UNAUTHORIZED_401.CODE){
          //   this._toast.error(this._httpConstants.REQUEST_STATUS.UNAUTHORIZED_401.MESSAGE);
          // }
          this.spinner.hide();
          this.dialog.closeAll();
          if (err.status == 401) {
            this._toast.error("Unauthorized User");
          }
          else if (err.status == 404) {
            this._toast.error("Not Found");
          }
          else if(err.status == 500){
            this._toast.error("Internal Server Error");
            this.dialog.closeAll();
          }
          else {
            this._toast.error("Unexpected Error Occured");
          }
        }
      )
    }
  }
  onError(error: any) {
    console.log(error);
    this.spinner.hide();
    if (error.status == 401) {
      this._toast.error("Unauthorized User");
      this.dialog.closeAll();
    }
    else if (error.status == 404) {
      this._toast.error("Not Found");
      this.dialog.closeAll();
    }
    else if(error.status == 500){
      this._toast.error("Internal Server Error");
      this.dialog.closeAll();
    }
    else {
      this._toast.error("Unexpected Error Occured");
      this.dialog.closeAll();
    }
  }
}
