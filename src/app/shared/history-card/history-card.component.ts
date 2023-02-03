import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/common/constants/app-constants';

@Component({
  selector: 'app-history-card',
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss']
})
export class HistoryCardComponent implements OnInit {
  @Input() cardData;
  @Input() messageData;
  id: any
  historyData: any =[]
  constructor(private _router : Router) { }

  ngOnInit(): void {
    console.log(this.cardData);
    if(this.messageData!=null){
      this.historyData=this.messageData;
    }
    console.log(this.messageData,"History");
    
  }

  routeToChatScreen(recipientId:any,chatName:any){
    localStorage.setItem('chatName',chatName);
    let roleId = localStorage.getItem('RoleId');
    if(roleId == AppConstants.LENDER_ID){
      this._router.navigateByUrl(`/lender/borrower/list/${roleId}/chat/${recipientId}`)
    }
    else if(roleId == AppConstants.BORROWER_ID){
      this._router.navigateByUrl(`/borrower/lender/list/${roleId}/chat/${recipientId}`)
    }
  }

}
