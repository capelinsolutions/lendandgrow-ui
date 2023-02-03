import { Component, OnInit, ViewChild } from '@angular/core';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-borrower-list',
  templateUrl: './borrower-list.component.html',
  styleUrls: ['./borrower-list.component.css']
})
export class BorrowerListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [6, 12, 18, 24];
  pageSize = 5;
  length = 1;
  lenderData: any = {
    toLink: '/lender/list/'
  }
  breadcrumbsList:any = [
    
    {
      title: 'Borrower List',
      url:'lender/borrower/list'
    },
  ]
  borrowerData:any = []
  constructor(private borrowerservice: BorrowerService,private _formBuilder: FormBuilder) { 
    this.createForm();
    this.getPropertyTypes();
  }
  
  filterForm: FormGroup = new FormGroup({});
  propertyTypes: any = [];
  createForm() {
    this.filterForm = this._formBuilder.group({
      name: [
        null
      ],
      city: [
        null
      ],
      state: [
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

  ngOnInit(): void {
    this.getborrowerswitgpagination();
    if(this.pageEvent){
      console.log(this.pageEvent);
    }
  }

  getPropertyTypes() {
    this.borrowerservice.getAllPropertyTypes().subscribe((d: any) => {
      this.propertyTypes = d.data.getAllPropertyTypes.data;
      console.log(d,"properties");
    });
  }

  searchByName(){
    if(this.pageEvent){
      this.filterForm.patchValue({
        pageNo: this.pageEvent.pageIndex,
        pageSize: this.pageEvent.pageSize
      })
    }
    
    if (this.filterForm.controls.name.value == "")
    {
      this.filterForm.controls.name.setValue(null);
    }
    if (this.filterForm.controls.city.value == "") 
    {
      this.filterForm.controls.city.setValue(null);
    }   
    if (this.filterForm.controls.state.value == "")
    {
      this.filterForm.controls.state.setValue(null);
    }
    if (this.filterForm.controls.propertyType.value == "") 
    {
      this.filterForm.controls.propertyType.setValue(null);
    } 
    console.log(this.filterForm.value,"form value");
    this.borrowerservice.getBorrower(this.filterForm.value).subscribe((res: any)=>{
      console.log(res);
      
      if(res?.data?.getBorrowerListByPagination!=null){
        this.borrowerData=res?.data?.getBorrowerListByPagination?.data.borrowers;
        console.log("Data is",this.borrowerData);
      }
    });
  }

  getborrowerswitgpagination(){
    console.log("List of borrowers")
    this.borrowerservice.getBorrower(this.filterForm.value).subscribe((res: any)=>{
      if(res?.data?.getBorrowerListByPagination.status == 200){
      console.log("data",res.data.getBorrowerListByPagination.data.borrowers)
      this.borrowerData=res.data.getBorrowerListByPagination.data.borrowers;
      this.length=res.data.getBorrowerListByPagination.data.totalRows;
      }
    });
  }

  handlePageEvent(event: PageEvent) {
    console.log(event);
    
    this.filterForm.controls.pageSize.setValue(event.pageSize);
    this.filterForm.controls.pageNo.setValue(event.pageIndex);
    this.borrowerservice.getBorrower(this.filterForm.value).subscribe((res: any)=>{
      if(res?.data?.getBorrowerListByPagination.status==200){
      console.log("data",res.data.getBorrowerListByPagination.data.borrowers)
      this.borrowerData=res.data.getBorrowerListByPagination.data.borrowers;
      this.length=res.data.getBorrowerListByPagination.data.totalRows;
      }
    });
  }

}
