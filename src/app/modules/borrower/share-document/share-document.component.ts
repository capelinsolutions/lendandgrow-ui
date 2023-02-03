import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONSTANTS } from 'src/app/common/constants/global-constants';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import { LenderService } from 'src/app/services/lender/lender.service';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { createSharedFile } from 'src/app/common/models/createProperty.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-share-document',
  templateUrl: './share-document.component.html',
  styleUrls: ['./share-document.component.scss']
})

export class ShareDocumentComponent implements OnInit {

  disableButton: Boolean = true
  separatorKeysCodes: number[] = [ENTER, COMMA];
  EMAIL_VALIDATION_PATTERN: string = CONSTANTS.EMAIL_VALIDATION_PATTERN;
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^([a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)*$/),
  ]);
  privacyType: string = '1';
  investorList: any = [];
  emails: string[] = [];
  createSharedDocumentDTO: createSharedFile = new createSharedFile();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private _toast: ToastrService,
    private _investorService: LenderService,
    private dialogRef: MatDialogRef<ShareDocumentComponent>,
    private dialog: MatDialog,
    private _borrowerService: BorrowerService) { }


  ngOnInit(): void {
    this.getAllInvestor();
  }

  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^([a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)*$/,
      );
  };

  getAllInvestor() {
    this._investorService.getAllInvestors().subscribe((res: any) => {
      if(res?.data?.getAllInvestor != null){
        this.investorList = res?.data?.getAllInvestor.data;
      }
    })
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    let doesExist = false;

    if (this.EMAIL_VALIDATION_PATTERN)
      if (value == "") {
        this._toast.error("Empty Text, Enter Email")
      }
      else {
        if (this.validateEmail(event.value)) {
          for (let i = 0; i < this.investorList.length; i++) {
            if (value == this.investorList[i].email) {
              doesExist = true;
            }
            if (i == this.investorList.length - 1) {
              if (doesExist == false) {
                this._toast.error("Email does not exist")
              }
              else {
                this.emails.push(value);
              }
            }
          }
        }
        else {
          this._toast.error("Email not Valid")
        }
      }
    // Clear the input value
    event.chipInput!.clear();
    this.email.setValue(null);
    if (this.emails.length > 0) {
      this.disableButton = false
    }
    else if (this.emails.length < 1) {
      this.disableButton = true
    }
  }

  remove(fruit: string): void {
    const index = this.emails.indexOf(fruit);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
    if (this.emails.length > 0) {
      this.disableButton = false
    }
    else if (this.emails.length < 1) {
      this.disableButton = true
    }
  }

  onSubmit() {
    this.spinner.show();
    let emailDocAccess = []
    if (this.emails.length > 1) {
      for (let i = 0; i < this.emails.length; i++) {
        emailDocAccess.push({ email: this.emails[i], documentAccess: this.data.documentAccess })
      }
    }
    else if (this.emails.length == 1) {
      emailDocAccess.push({ email: this.emails[0], documentAccess: this.data.documentAccess })
    }
    this.createSharedDocumentDTO = { propertyId: this.data.propertyId, emailsDocumentAccess: emailDocAccess }
    this._borrowerService.createSharedFile(this.createSharedDocumentDTO).subscribe((res: any) => {
      if (res.data.createSharedFile != null) {
        this.spinner.hide();
        this._toast.success("Document Shared Successfully");
        this.dialog.closeAll();
      }
      else {
        this.spinner.hide();
        this._toast.error("Error occured in sharing document");
      }

    })
  }

}
