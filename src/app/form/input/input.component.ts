import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FieldConfig } from "../../common/interface/field.interface";

@Component({
  selector: 'app-input',
  template: `
  <mat-form-field class="demo-full-width " [formGroup]="group">
  <input *ngIf="field.inputType!='file'" matInput class="abc" [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType" autocomplete="off">
  <input *ngIf="field.inputType=='file'" hidden="true" matInput />
  <input *ngIf="field.inputType=='file' && field.label=='Property Image(s)'" class="abc" [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType" autocomplete="off" (change)="onUploadImage($event)" multiple accept="image/png, image/jpg, image/jpeg">
  <input *ngIf="field.inputType=='file' && field.label=='Property Document(s)'" class="abc" [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType" autocomplete="off" (change)="onUploaddocument($event)" multiple accept="application/pdf,application/vnd.ms-excel">
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
  <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
  </mat-form-field>
  `,
  styles: []
})
export class InputComponent implements OnInit {

  field: FieldConfig;
  group: FormGroup;
  fileName = ""
  imagesArray: any = []
  folderId=""
  onUploadImage(e) {
    const formData = new FormData();
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.folderId = params.get('folderId');
    });
    for (var i = 0; i < e.target.files.length; i++) {
      const file: File  = e.target.files[i];
      if(file){
        this.fileName = file.name;
        formData.append("files", file, this.fileName);
      }
    }
    formData.append("propertyId", '');
    formData.append("fileType", "property_image_type");
    this._userService.uploadImageApiforProperty(formData).subscribe((res)=>{
      console.log(res);
      this.imagesArray=res;
      localStorage.setItem("Urls",this.imagesArray);
      
    })
  }
  onUploaddocument(e) {
    const formData = new FormData();
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.folderId = params.get('folderId');
    });
    for (var i = 0; i < e.target.files.length; i++) {
      const file: File  = e.target.files[i];
      if(file){
        this.fileName = file.name;
        formData.append("files", file, this.fileName);
      }
    }
    formData.append("propertyId", '');
    formData.append("fileType", "property_file_type");
    this._userService.uploadImageApiforProperty(formData).subscribe((res)=>{
      console.log(res);
      this.imagesArray=res;
      localStorage.setItem("Urls",this.imagesArray);
      
    })
  }
  constructor(private _userService: UserService,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
  }

}
