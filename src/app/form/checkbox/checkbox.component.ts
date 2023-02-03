import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../common/interface/field.interface";

@Component({
  selector: 'app-checkbox',
  template: `
  <div class="demo-full-width margin-top checkBox" [formGroup]="group" >
  <mat-checkbox *ngFor="let item of field.options; let i = index"
    [formControlName]="field.name" [value]="item">{{item}}</mat-checkbox>
  </div>
  `,
  styles: []

})
export class CheckboxComponent implements OnInit {

  field: FieldConfig;
  group: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  onChange(event:any){
    console.log(event);
    
  }

}
