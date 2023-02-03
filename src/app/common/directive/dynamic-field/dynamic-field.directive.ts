import { Directive, NgModule, OnChanges, OnDestroy } from '@angular/core';
import {
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewContainerRef
} from "@angular/core";

import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../interface/field.interface";
import { InputComponent } from "../../../form/input/input.component";
import { SelectComponent } from "../../../form/select/select.component";
import { RadiobuttonComponent } from "../../../form/radiobutton/radiobutton.component";
import { CheckboxComponent } from "../../../form/checkbox/checkbox.component";

const componentMapper = {
  input: InputComponent,
  select: SelectComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent
};


@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit, OnDestroy {

  @Input() field: FieldConfig;
  @Input() group: FormGroup
  componentRef: ComponentRef<any>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) 
  { 
    
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    if(this.componentRef) {
      this.componentRef.destroy();
    }
  }

  loadComponent(){
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.field.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }


}

@NgModule({
  declarations: [ DynamicFieldDirective ],
  exports: [ DynamicFieldDirective ]
})

export class DynamicFieldDirectiveModule {}
