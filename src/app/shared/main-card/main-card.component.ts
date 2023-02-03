import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.css']
})
export class MainCardComponent implements OnInit {

  @Input() data;
  user = {
    role: "lender"
  }
  id: any = '';
  link: string;
  constructor() { }

  ngOnInit(): void {
    console.log("borrowerdata", this.data);
    if (Object.keys(this.data).length > 0) {
      this.id = this.data.borrowerId ? this.data.borrowerId : this.data.investorId;
    }
  }
}
