import { CONSTANTS } from '../../../common/constants/global-constants';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-folder',
  templateUrl: './share-folder.component.html',
  styleUrls: ['./share-folder.component.scss']
})
export class ShareFolderComponent implements OnInit {

  EMAIL_VALIDATION_PATTERN: string = CONSTANTS.EMAIL_VALIDATION_PATTERN;
  email: FormControl = new FormControl('', 
  [
   Validators.required,
   Validators.pattern(/^([a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)*$/),
  ]);
  privacyType: string = '1';

  constructor() { }

  ngOnInit(): void {
  }

  submit(e){
    console.log(this.privacyType);
  }
}
