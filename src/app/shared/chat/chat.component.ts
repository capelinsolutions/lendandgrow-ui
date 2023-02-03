import { AfterContentChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql, QueryRef } from "apollo-angular";
import { Subscription } from 'rxjs/internal/Subscription';
import { GraphqlModule } from 'src/app/graphql/graphql.module';
import { ChatService } from 'src/app/services/chat/chat.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  
  typedMessage : any = '';
  Subscription: Subscription;
  messageList: Array<any> = [];
  userId : any;
  chatName : any;
  recipientId : any;
  pageNo = 0;
  pageSize = 10;
  imageUrl = "";
  @ViewChild('scrollMainDiv') private myScrollContainer: ElementRef;

 
  breadcrumbsList: any = [
    {
      title: 'History',
      url: '/borrower/documents',
    },
    {
      title: 'Profile',
      url: '/borrower/documents',
    },
  ];
  constructor(
    private apollo:Apollo,
    private _chatService : ChatService,
    private _graphqlService : GraphqlService,
    private _activatedRoute : ActivatedRoute,
    private _UserService: UserService
    ) { }

  ngOnInit(): void {
    this.getUserIdFromRoute();
    this.listenMessage();
    this.scrollToBottom();
  }


  scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer?.nativeElement?.scrollHeight;
  }

  getUserIdFromRoute(){
    this.recipientId = this._activatedRoute.snapshot.paramMap.get('userId');
    this.userId = localStorage.getItem('userId');
    this.chatName = localStorage.getItem('chatName');
    this.getChatHistory();
    this.getImageUrl();
  }

  getChatHistory(){
    let payLoad = {
      senderId : this.userId,
      recipientId : this.recipientId,
      pageNo : this.pageNo,
      pageSize : this.pageSize
    }
    this._chatService.getAllChatMessage(payLoad).subscribe((res:any) => {
      console.log('Response ====>',res);
      if(res?.data?.getMessagesByRecipientIdAndUserIdByPagination?.status == 200){
        this.messageList = res?.data?.getMessagesByRecipientIdAndUserIdByPagination?.data?.chatMessages;
        this.messageList = [...this.messageList].reverse();
      }
    })
  }
  

  timeCovert(time){
    let hours = time.split(':')[0];
    let AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let minutes = time.split(':')[1];
    let finalTime = hours + ":" + minutes + " " + AmOrPm;
    return finalTime;
  }


  sendMessage(){
    let payLoad = {
      userId : this.recipientId,
      message : this.typedMessage
    }
    if(this.typedMessage != ''){
      this.typedMessage = '';
      this._chatService.sendMessage(payLoad).subscribe((res:any) => {
        console.log('SendMessage',res);
        this.messageList = [...this.messageList,res?.data?.sendMessage?.data];
      })
    }
  }

  

  listenMessage(){
    this.Subscription = this.apollo.subscribe({ 
      query: GET_ALLMESSAGEBY_USERID,
      variables: {
         senderId : this.recipientId
      }
      })
      .subscribe(({ data }) => {
        console.log('RecieveMessage',data);
        this.messageList = [...this.messageList,data['getChatMessageData']];
      });
  }

  listenAllMessage(){
    this.Subscription = this.apollo.subscribe({query: GET_ALLMESSAGE })
      .subscribe(({ data }) => {
        console.log('RecieveMessage',data);   
        this.messageList = [...this.messageList, data];
      });
  }

  getImageUrl(){
    this._UserService.getRecipientImageUrl(this.recipientId).subscribe((res:any)=>{
      console.log(res,"Image Response");
      this.imageUrl = res?.data?.getProfileImageUrlByUserId?.data;
    })
  }

  ngOnDestroy(){
    this.Subscription.unsubscribe();
  }

}


const GET_ALLMESSAGEBY_USERID =  gql`
subscription($senderId : String!){
  getChatMessageData(senderId : $senderId){
      id
      content
      recipientId
      senderId
      sendAt
      isRead
  }
}`;


const GET_ALLMESSAGE = gql`subscription{
  getChatMessages{
    id
    content
    senderId
    recipientId
    sendAt
}
}`


