import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-borrower-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  pageSizeOptions: number[] = [5, 10, 15, 24];
  pageSize = 5;
  totalRows = 0;
  historyData: any = {
    toLink: '/borrower/history/1'
  }
  breadcrumbsList:any = [
    {
      title: 'Lender List',
      url:'/borrower/lender/list'
    },
    {
      title: 'Chat History',
      url:'/borrower/history'
    },
  ]
  messageHistory: any = []
  historyLength: any = 0;
  name: any = "";
  constructor(private _userService:UserService) { }

  ngOnInit(): void {
    this.getUserMessageHistory();
    this.getUser();
  }

  getUserMessageHistory(){
    this._userService.getMessageHistory().subscribe((res:any)=>{
        if(res?.data?.getAllChatHistory!=null){
            this.historyLength=res?.data?.getAllChatHistory?.data.chatHistory;
            this.totalRows=this.historyLength?.length;
            this.messageHistory=res?.data?.getAllChatHistory?.data;
            console.log(this.historyLength,"History length");  
            console.log(this.messageHistory,"Message");
        }
    })
  }

  getUser(){
    let roleId=localStorage.getItem("RoleId");
    console.log(roleId);
    
    if(roleId!=null){
      if(roleId=="624e7c99007730778c60baeb"){
        this.name="Borrower"
        this.historyData = {
          toLink: '/lender/history/1'
        }
        this.breadcrumbsList= [
          {
            title: 'Borrower List',
            url:'/lender/borrower/list'
          },
          {
            title: 'Chat History',
            url:'/lender/history'
          },
        ]
      }
      else{
        this.name="Investor"
        this.breadcrumbsList= [
          {
            title: 'Chat History',
            url:'/borrower/history'
          },
        ]
      }
    }
  }

}
