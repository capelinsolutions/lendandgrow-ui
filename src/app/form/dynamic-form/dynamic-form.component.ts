import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Subject } from 'rxjs';
import { FieldConfig, Validator } from "../../common/interface/field.interface";

@Component({
  // exportAs: "dynamicForm",
  selector: 'app-dynamic-form',
  template: `
  <form class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)">
  <ng-container *ngFor="let field of fields;" [field]="field" [group]="form" dynamicField>
  </ng-container>
  <button type="submit" mat-raised-button class="btn btn-primary" [class.disable-btn]="propertyInfo.invalid || form.invalid">Submit</button>
  </form> 
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .dynamic-form{
      display: inline
    }`]
})
export class DynamicFormComponent implements OnInit, OnChanges  {

  @Input() fields: FieldConfig[] = [];
  @Input() propertyInfo;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createControl();
    console.log(this.propertyInfo,"Info property");
    
  }

  ngOnChanges() {
    this.form = this.createControl();
  } 

  get value() {
    return this.form.value;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form);
    } 
    else {
      this.validateAllFormFields(this.form);
    }
  }

  createControl() {    
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === "button") return;
      const control = this.fb.control(
        field.value,
        this.bindValidations(field.validations || [])
      );
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {          
        switch (valid.name){
          case ('required'):
          validList.push(Validators.required);
          break;   
          case ('pattern'):
          let regex = this.extractRegex(valid.validator); 
          validList.push(Validators.pattern(regex));
          break;  
        }
      });
      return Validators.compose(validList);
    }
    return null;
  }

  extractRegex(regex : any){
    return regex.split("'")[1];
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }


}


