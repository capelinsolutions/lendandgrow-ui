import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';

@Component({
  selector: 'app-borrower-details',
  templateUrl: './borrower-details.component.html',
  styleUrls: ['./borrower-details.component.scss']
})
export class BorrowerDetailsComponent implements OnInit {

  breadcrumbsList:any = [
    {
      title: 'Borrower List',
      url:'/lender/borrower/list'
    },
    {
      title: 'Borrower Details',
      url:'/lender/borrower/list/:id'
    }
  ]
  deals: any = [
    {
      id: 1,
      name: 'Muhammad Haad',
      price: '300'
    },
    {
      id: 12,
      name: 'Muhammad Qasim',
      price: '300'
    },
    {
      id: 13,
      name: 'Muhammad Junaid',
      price: '600'
    },
  ]

  borrowerId: any;
  data: any = [];
  data2: any = [];
  sortedList: any = [];

  constructor(
    private route: ActivatedRoute,
    private borrowerservice: BorrowerService,
    private _toast: ToastrService
    ) 
    {
    this.route.params.subscribe(res => {
      console.log("Borrower ID",res.id)
      this.borrowerId = res.id;
    });
  }


  ngOnInit(): void {
    this.getBorrower();
    this.getBorrowerProperties();
  }

  getBorrower(){
    this.borrowerservice.getBorrowerById(this.borrowerId).subscribe((res:any) => {
      this.data=res?.data?.getBorrowerById?.data;
      localStorage.setItem('chatName',this.data?.name)
      console.log(this.data,"borrower data");
    })
  }

  getBorrowerProperties(){
    this.borrowerservice.getAllPropertByBorrowerId(this.borrowerId).subscribe((res: any) => {
      if(res?.data?.getAllPropertyByBorrowerId != null){
        this.deals=res?.data?.getAllPropertyByBorrowerId?.data;
        if(this.deals?.length>1 && this.deals?.length == 3){
          for(let i=0;i<3;i++){
            this.sortedList.push(this.deals[i])
          }
        }
        else if(this.deals?.length>3){
          for(let i=0;i<3;i++){
            this.sortedList.push(this.deals[i])
          }
        }
        else if(this.deals?.length<3){
          for(let i=0;i<this.deals?.length;i++){
            this.sortedList.push(this.deals[i])
          }
        }
      }
      else if(res?.data?.getAllPropertyByBorrowerId==null){
        this.deals=res?.data?.getAllPropertyByBorrowerId?.data;
        if(res?.errors[0]?.message){
          // this._toast.error(res?.errors[0]?.message);
        }
      }
    })
  }
}
