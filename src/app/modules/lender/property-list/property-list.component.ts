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
  pageEvent: PageEvent;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 18, 24];
  length = 0;
  borrowerId: any;
  propertyForm: FormGroup = new FormGroup({});
  Data: any = [];
  propertyTypes: any = [];


  breadcrumbsList:any = [
    {
      title: 'Profile',
      url:'/lender/profile'
    },
    {
      title: 'Property List',
      url:'/lender/profile/property'
    },
  ]
  constructor(
    private _borrowerService: BorrowerService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.borrowerId=res.id;
    });
    this.createForm();
    this.getPropertyTypes();
    this.getAllPropertiesByPagination();
  }

  getPropertyTypes() {
    this._borrowerService.getAllPropertyTypes().subscribe((d: any) => {
      this.propertyTypes = d.data.getAllPropertyTypes.data;
    });
  }


  createForm() {
    this.propertyForm = this._formBuilder.group({
      city: [
        null
      ],
      address: [
        null
      ],
      priceStart: [
        null
      ],
      priceEnd: [
        null
      ],
      propertyType: [
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
    if (this.propertyForm.controls.city.value == ""){
      this.propertyForm.controls.city.setValue(null);
    }
    if (this.propertyForm.controls.address.value == "") {
      this.propertyForm.controls.address.setValue(null);
    }   
    if (this.propertyForm.controls.priceStart.value == ""){
      this.propertyForm.controls.priceStart.setValue(null);
    }
    if (this.propertyForm.controls.priceEnd.value == "") {
      this.propertyForm.controls.priceEnd.setValue(null);
    } 
    if (this.propertyForm.controls.propertyType.value == "") 
    {
      this.propertyForm.controls.propertyType.setValue(null);
    } 
    this._borrowerService.getPropertyList(this.propertyForm.value).subscribe((res: any) => {      
      this.Data = res?.data?.getPropertyListByPaginationWithFilter?.data?.property;
      this.length = res?.data?.getPropertyListByPaginationWithFilter?.data?.totalRows;      
    });
  }

  getAllPropertiesByPagination(){
    this._borrowerService.getPropertyList(this.propertyForm.value).subscribe((res:any)=>{
      console.log('Property List',res);
      this.Data=res?.data?.getPropertyListByPaginationWithFilter?.data?.property;
      this.length=res?.data?.getPropertyListByPaginationWithFilter?.data?.totalRows;
    })
  }

  handlePageEvent(event: PageEvent) {
    this.propertyForm.controls.pageSize.setValue(event.pageSize);
    this.propertyForm.controls.pageNo.setValue(event.pageIndex);
    this._borrowerService.getPropertyList(this.propertyForm.value).subscribe((res: any)=>{
      this.Data=res?.data?.getPropertyListByPaginationWithFilter?.data?.property;
      this.length=res?.data?.getPropertyListByPaginationWithFilter?.data?.totalRows;      
    });
  }
  
}
