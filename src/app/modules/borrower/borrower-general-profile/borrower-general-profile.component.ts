import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-borrower-general-profile',
  templateUrl: './borrower-general-profile.component.html',
  styleUrls: ['./borrower-general-profile.component.scss']
})
export class BorrowerGeneralProfileComponent implements OnInit {

  historyData: any = {
    toLink: '/borrower/project'
  }
  breadcrumbsList:any = [
    
    {
      title: 'Lender List',
      url:'/borrower/list'
    },
    {
      title: 'Lender Detail',
      url:'/borrower/list/1'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
