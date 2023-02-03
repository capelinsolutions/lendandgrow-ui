import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  propertyForm: FormGroup = new FormGroup({});
  Data: any = [];
  pageEvent: PageEvent;
  pageSize : number = 6;
  pageSizeOptions: number[] = [6, 12, 18, 24];
  length = 0;
  borrowerId: any
  breadcrumbsList:any = [
    {
      title: 'Profile',
      url:'/borrower/profile'
    },
    {
      title: 'Property List',
      url:'/borrower/profile/property'
    },
  ]
  constructor(
    private _borrowerService: BorrowerService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.borrowerId = res.id;
    });

    this.createForm();
    this.getAllPropertiesByPagination();
  }


  createForm() {
    this.propertyForm = this._formBuilder.group({
      title: [
        null
      ],
      area: [
        null
      ],
      priceStart: [
        null
      ],
      priceEnd: [
        null
      ],
      pageNo: [
        0
      ],
      pageSize: [
        6
      ],
    });
  }

  search(){
    if(this.pageEvent){
      this.propertyForm.patchValue({
        pageNo: this.pageEvent.pageIndex,
        pageSize: this.pageEvent.pageSize
      })
    }
    // console.log(this.propertyForm.value,"form value");
    let data = this.propertyForm.value;
    if (this.propertyForm.controls.title.value == "")
    {
      this.propertyForm.controls.title.setValue(null);
    }
    if (this.propertyForm.controls.area.value == "") 
    {
      this.propertyForm.controls.area.setValue(null);
    }   
    if (this.propertyForm.controls.priceStart.value == "")
    {
      this.propertyForm.controls.priceStart.setValue(null);
    }
    if (this.propertyForm.controls.priceEnd.value == "") 
    {
      this.propertyForm.controls.priceEnd.setValue(null);
    } 
    this._borrowerService.getPropertiesByPagination(this.propertyForm.value,this.borrowerId).subscribe((res: any)=>{
      this.Data=res?.data?.getPropertyListByPagination?.data?.property;
      this.length=res?.data?.getPropertyListByPagination?.data?.totalRows;
      // console.log("Data is",this.Data);
      
    });
  }

  getAllPropertiesByPagination(){
    this._borrowerService.getPropertiesByPagination(this.propertyForm.value,this.borrowerId).subscribe((res:any)=>{
      // console.log(res);
      this.Data=res?.data?.getPropertyListByPagination?.data?.property;
      this.length=res?.data?.getPropertyListByPagination?.data?.totalRows;
    })
  }

  handlePageEvent(event: PageEvent) {
    // console.log(event);
    this.propertyForm.controls.pageSize.setValue(event.pageSize);
    this.propertyForm.controls.pageNo.setValue(event.pageIndex);
    this._borrowerService.getPropertiesByPagination(this.propertyForm.value,this.borrowerId).subscribe((res: any)=>{
      this.Data=res?.data?.getPropertyListByPagination?.data?.property;
      this.length=res?.data?.getPropertyListByPagination?.data?.totalRows;
      // console.log("Data is",this.Data);
      
    });
  }
  
}
