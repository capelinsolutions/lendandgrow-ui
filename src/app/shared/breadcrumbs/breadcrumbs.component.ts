import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  @Input() breadcrumbsList: any;
  constructor() { }
  home: any = ""
  ngOnInit(): void {
    console.log(this.breadcrumbsList);
    this.getRoleId();
  }
  getRoleId(){
    let id=localStorage.getItem("RoleId");
    if(id!=null){
      if(id=="624e7c99007730778c60baeb"){
        this.home="/lender/dashboard"
      }
      else{
        this.home="/borrower/dashboard"
      }
    }
    else{
      this.home="/home"
    }
  }

}
