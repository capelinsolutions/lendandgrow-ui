import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LenderService } from 'src/app/services/lender/lender.service';

@Component({
  selector: 'app-lender-list',
  templateUrl: './lender-list.component.html',
  styleUrls: ['./lender-list.component.css']
})
export class LenderListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [6, 12, 18, 24];
  pageSize = 6;
  length = 50;
  Data: any = []
  constructor(private _lenderService: LenderService,private _formBuilder: FormBuilder) { 
    this.createForm();
    this.getFeeStructure();
  }

  filterForm: FormGroup = new FormGroup({});
  feeStructureArray: any = [];
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
      feeStructure: [
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
  borrowerData: any = {
    toLink: '/borrower/lender/list/'
  }

  breadcrumbsList:any = [
    
    {
      title: 'Lender List',
      url:'/borrower/lender/list'
    },
  ]


  ngOnInit(): void {
    this.getlenderswitgpagination();
  }

  getFeeStructure() {
    this._lenderService.getfeeStructure().subscribe((d: any) => {
      this.feeStructureArray = d.data.getAllFeeStructure.data;
    });
  }


  searchByName(){
    if(this.pageEvent){
      this.filterForm.patchValue({
        pageNo: this.pageEvent.pageIndex,
        pageSize: this.pageEvent.pageSize
      })
    }
    let data = this.filterForm.value;
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
    if (this.filterForm.controls.feeStructure.value == "") 
    {
      this.filterForm.controls.feeStructure.setValue(null);
    } 
    this._lenderService.getInvestor(this.filterForm.value).subscribe((res: any)=>{
      this.Data=res?.data?.getInvestorListByPagination?.data.investors;
    });
  }
  getlenderswitgpagination(){
    this._lenderService.getInvestor(this.filterForm.value).subscribe((res: any)=>{
      this.Data=res?.data?.getInvestorListByPagination?.data.investors;
      this.length=res?.data?.getInvestorListByPagination?.data.totalRows;
    });
}

handlePageEvent(event: PageEvent) {
  this.filterForm.controls.pageSize.setValue(event.pageSize);
  this.filterForm.controls.pageNo.setValue(event.pageIndex);
  this.getlenderswitgpagination();
}
}