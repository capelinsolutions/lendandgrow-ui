import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Auth } from 'aws-amplify';
import * as moment from 'moment';
import { AppConstants } from 'src/app/common/constants/app-constants';
import { AuthComponent } from 'src/app/modules/auth/auth.component';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { LenderService } from 'src/app/services/lender/lender.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() hasBackdrop: boolean = true;
  @Output() backdropClick: EventEmitter<void>
  token: any = 'ad';
  isLoggedIn: any = false;
  loggedRole: any = ""
  role: any = ""
  opened: boolean = false;
  isButtonVisible: boolean = true;
  userData: any
  @ViewChild('drawer') drawer: MatDrawer;
  notificationList : Array<any> = [];
  notificationCount : any = 0;
  showNoDataFound : boolean = false;
  showMoreNotification : boolean = false;
  ScrollDistance = 2;
  ScrollThrottle = 100;
  scrollList : Array<any> = [];
  scrollLength = 3;
  notificationClick = false;
  borroweritem: any =
    [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        url: '/borrower/dashboard'
      },
      {
        title: 'Profile',
        icon: 'account_circle',
        url: '/borrower/profile'
      },
      {
        title: 'Investor List',
        icon: 'list',
        url: '/borrower/lender/list'
      },
      {
        title: 'My Property',
        icon: 'home',
        url: '/borrower/profile/property'
      },
      {
        title: 'Messages',
        icon: 'history',
        url: '/borrower/history'
      },
      {
        title: 'My Documents',
        icon: 'insert_drive_file',
        url: '/borrower/documents'
      },
      // {
      //   title: 'Logout',
      //   icon: 'logout',
      //   url: '/'
      // }
    ]
  lenderitem: any =
    [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        url: '/lender/dashboard'
      },
      {
        title: 'My Profile',
        icon: 'account_circle',
        url: '/lender/profile'
      },
      {
        title: 'Messages',
        icon: 'history',
        url: '/lender/history'
      },
      {
        title: 'Borrower List',
        icon: 'list',
        url: '/lender/borrower/list'
      },
      {
        title: 'Property List',
        icon: 'list',
        url: '/lender/property/list'
      }
    ];

  items: any = [{
    icon: "home",
    title: 'My Profile',
    url: '/lender/profile'
  }];

  navItems: any =
    [
      {
        title: 'About',
        icon: 'home',
        url: '/borrower/history'
      },
      {
        title: 'Help',
        icon: 'home',
        url: '/borrower/documents'
      },
      {
        title: 'Terms of use',
        icon: 'home',
        url: '/borrower/properties'
      },
      {
        title: 'Privacy portal',
        icon: 'home',
        url: '/lender/profile'
      }
    ]


  imageUrl: ""
  constructor(
    private dialog: MatDialog,
    private router: Router, 
    private _userService: UserService, 
    private _authService: AuthServiceService,
    private apollo: Apollo,
    private _lenderService: LenderService,
    private _BorrowerService: BorrowerService,
    private ref: ChangeDetectorRef,
    private _notifyService : NotificationService,
    private _chatService: ChatService
    ) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn')
    this.notificationCount = localStorage.getItem("notificationCount");
    this.notificationList = JSON.parse(localStorage.getItem("notificationList"));
    this.getAllNotifications();
    this.getAllNotificationWhenLoggedIn();
    if(this.isLoggedIn){
      this.notificationBox();
      this.getAllNotifications();
    }
    else{
      $('#bell').hide();
    }
    this.getCache();
    this.getUserData();
    this.ref.detectChanges();
    this.ref.markForCheck();
    let down=false;
    let click=this.notificationClick;
    // window.addEventListener("click", function(event) {
    //   console.log(click,"Not click");
      
    //   console.log(event,"Event is");
    //   $(document).ready(function(){
    //   $('#bell').click(function(e){
    //     console.log("inside bell");
    //       click=true;
    //       if(down){ 
    //         $('#box').css('height','0px');
    //         $('#box').css('opacity','0');
    //         $('#box').css('display','none');
    //         down = false
    //     }else{         
    //         $('#box').css('height','auto');
    //         $('#box').css('opacity','1');
    //         $('#box').css('display','block');
    //         down = true;    
    //     }
    //     });
    //     if(click==true){
    //       console.log("inside click true");
    //     }
    //     else{
    //       console.log("inside click false");
    //       if(down){ 
    //         $('#box').css('height','0px');
    //         $('#box').css('opacity','0');
    //         $('#box').css('display','none');
    //         down = false
    //     }
    //     }
    //   });
    // });
  }

  routeToDashboard(){    
    let roleId = localStorage.getItem('RoleId');
    if(roleId ==  AppConstants.BORROWER_ID){
      this.router.navigate(['borrower/dashboard']);
    }
    else if(roleId == AppConstants.LENDER_ID){
      this.router.navigate(['lender/dashboard']);
    }
  }

  

  onClickShowMoreNotifications(){
    this.showMoreNotification=true;
    this.ref.detectChanges();
    console.log(this.showMoreNotification,"show notification");
    
  }

  routeToChatScreen(recipientId:any,chatName:any){
    console.log(recipientId,"Sender Id");
    localStorage.setItem('chatName',chatName);
    let roleId = localStorage.getItem('RoleId');
    this.readAllMessage(recipientId);
      this.getAllNotifications();
      this.notificationCount = localStorage.getItem("notificationCount");
      this.notificationList = JSON.parse(localStorage.getItem("notificationList"));
      this.notificationList.map((x)=> {
        if(this.notificationCount>0){
          if(x.senderId==recipientId){
            console.log(x,"User to delete is");
            this.notificationCount = this.notificationCount - x.count;
          }
        }
        
      })
      console.log(recipientId,"recid");
      if(this.notificationList.length==1){
        this.notificationList.pop();
      }
      else{
        this.notificationList=this.notificationList.filter((x)=> x.senderId!=recipientId);
      }
      

      console.log(this.notificationList,"filtered items");
      console.log(this.notificationList,"After filtering");
      localStorage.setItem("notificationCount",this.notificationCount);
      localStorage.setItem("notificationList",JSON.stringify(this.notificationList));
      var down=true;
      $(document).ready(function(){
        console.log(this.down,"Down is");
        
          if(down){ 
              $('#box').css('height','0px');
              $('#box').css('opacity','0');
              $('#box').css('display','none');
              down = false
          }
      });
    if(roleId == AppConstants.LENDER_ID){
      this.router.navigate([`/lender/borrower/list/${roleId}/chat/${recipientId}`]);
    //   this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
    //     this.router.navigate([`/lender/borrower/list/${roleId}/chat/${recipientId}`]);
    // }); 
    }
    else if(roleId == AppConstants.BORROWER_ID){
      this.router.navigate([`/borrower/lender/list/${roleId}/chat/${recipientId}`]);
    }
  }

  readAllMessage(recipientId:any){
    this._chatService.readAllMessages(recipientId).subscribe((res:any)=>{
      console.log(res,"Reading all messages");
      
    })
  }

  notificationBox(){
    var down =false;
      $(document).ready(function(){
        $('#bell').click(function(e){
          this.notificationClick=true;
          var color = $(this).text();
          if(down){ 
              $('#box').css('height','0px');
              $('#box').css('opacity','0');
              $('#box').css('display','none');
              down = false
          }else{         
              $('#box').css('height','auto');
              $('#box').css('opacity','1');
              $('#box').css('display','block');
              down = true;    
          }
      });
      })
  }

  getAllNotificationWhenLoggedIn(){
    this._authService.isLoggedIn.subscribe((res:any) => {
      console.log(res,"Isloggedin");
      
      if(res == true){        
        this.getAllNotifications();
        this.getAllNotificationsWithApi();
      }
    })
  }

  getAllNotifications(){
    this.apollo.subscribe({ query: GET_ALL_NOTIFICATION })
      .subscribe(({ data }) => {
        console.log('RecieveNotification',data);
        this.notificationList = data['getChatMessageNotificationData']['notifications'];
        this.notificationCount = data['getChatMessageNotificationData']['totalCount'];
        this.notificationList=this.sortArray(this.notificationList);
        this.scrollList=[];
        if(this.notificationList?.length>0){
          if(this.notificationList?.length<=3){
            for(let i=0;i<this.notificationList?.length;i++){
              if(this.notificationList[i]){
                this.scrollList[i]=this.notificationList[i];
                console.log(this.scrollList[i]);
              }
              else{
                break;
              }
            }
          }
          else{
            for(let i=0;i<3;i++){
              if(this.notificationList[i]){
                this.scrollList[i]=this.notificationList[i];
                console.log(this.scrollList[i]);
              }
              else{
                break;
              }
            }
          }
        }
        console.log(this.scrollList,"Scrolllist");
        console.log(this.notificationList,"Notification list object");
        console.log(this.notificationCount,"Notification Count");
        localStorage.setItem("notificationCount",this.notificationCount);
        localStorage.setItem("notificationList",JSON.stringify(this.notificationList));
      });
  }

  sortArray(msgArray : Array<any>){
    msgArray = JSON.parse(JSON.stringify(msgArray))
    console.log(msgArray[0].sendAt);

    console.log(new Date(msgArray[0].sendAt.replace("PKT","")));
    console.log(moment(msgArray[0].sendAt,"E, d MMM yyyy HH:mm:ss Z"),"Date");
    
    
    
    return msgArray.sort((a, b) => new Date(b?.sendAt.replace("PKT","")).getTime() - new Date(a?.sendAt.replace("PKT","")).getTime());
  }

  getAllNotificationsWithApi(){
    this._notifyService.getAllNotifications().subscribe((res:any)=>{
      this.notificationList=res?.data?.getAllNotifications?.data?.notifications;
      this.notificationCount=res?.data?.getAllNotifications?.data?.totalCount;
      console.log(this.notificationList,"get notifications by api");
      this.notificationList=this.sortArray(this.notificationList);
      console.log(this.notificationList,"get notifications by api");
      if(this.notificationList?.length>0){
        if(this.notificationList?.length<=3){
          for(let i=0;i<this.notificationList?.length;i++){
            if(this.notificationList[i]){
              this.scrollList[i]=this.notificationList[i];
              this.scrollList[i].sendAt=this.scrollList[i].sendAt.split(" ");
              console.log(this.scrollList[i].sendAt[3]);
              console.log(this.scrollList[i]);
            }
            else{
              break;
            }
          }
        }
        else{
          for(let i=0;i<3;i++){
            if(this.notificationList[i]){
              this.scrollList[i]=this.notificationList[i];
              this.scrollList[i].sendAt=this.scrollList[i].sendAt.split(" ");
              console.log(this.scrollList[i].sendAt[3]);
              console.log(this.scrollList[i]);
            }
            else{
              break;
            }
          }
        }
      }
    })
  }

  onScrollDown() {
    console.log('scrolled!!');
    console.log(this.scrollList,"Scrolllist");
    
    for(let i=this.scrollList?.length;i<this.scrollList?.length+2;i++){
      if(this.notificationList[i]){
        this.scrollList[i]=this.notificationList[i];
      }
      else{
        break;
      }
    }
  }



  logout() {
    $('#bell').hide();
    this.apollo.client.resetStore();
    this.apollo.getClient().clearStore();
    localStorage.clear();
    this.router.navigate(['/home']);
    this._authService.isLoggedInSource.next(false);
    this._authService.setItems([]);
    this.userData=[];
    this._authService.setUserData([]);
    this.isLoggedIn = false;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  getUserData(){
    let roleId = localStorage.getItem('RoleId');
    if(roleId===AppConstants.LENDER_ID){
      this._lenderService.getSingleInvestor().subscribe((res:any)=>{
      console.log(res,"UserData");
        this.userData =  res.data.getInvestor.data;
        localStorage.setItem("investorId",this.userData.investorId);
      })
    }
    else if(roleId===AppConstants.BORROWER_ID){
      this._BorrowerService.getSingleBorrower().subscribe((res:any)=>{
        console.log(res,"UserData");
        this.userData = res?.data?.getBorrower?.data;
        localStorage.setItem("borrowerId",this.userData.borrowerId);
      })
    }
    else{
      this.userData = []
    }
  }

  getCache() {
    this._authService.$items.subscribe((res) => {
      this.items = res;
    })

    this._authService.$navButton.subscribe((res) => {
      this.isButtonVisible = res;
    })

    this._authService.$userDdata.subscribe((res)=>{
      // console.log(res);
      
      this.userData=res;
      console.log("UserData",this.userData);
      
      this.imageUrl=this.userData.profileImageURL;
    })

    this._authService.$profileImage.subscribe((res)=>{
      console.log(res,"nav res");
      let data={...this.userData};
      data.profileImageURL=res;
      this.userData=data;
    })

    this._authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
      if (res) {
        let roleId = localStorage.getItem('RoleId')
        roleId === '624e7c99007730778c60baeb' ? this.items = this.lenderitem : this.items = this.borroweritem;
      }
    });
    
  }

  sideClick() {
    console.log("click value side click " + this.isButtonVisible)
    // this.isButtonVisible = !this.isButtonVisible;
  }
  close(reason: string) {
    // this.drawer.close();
    // this.isButtonVisible = !this.isButtonVisible;
    console.log("click value on close " + this.isButtonVisible)
    
  }
  getCurrentSession = async () => {
    try {
      let user = await Auth.currentAuthenticatedUser();
      if (user) {
        this.token = await Auth.currentSession()
        if (this.token) {
          this.isLoggedIn = true;
        }
      }
    } catch (err) {

      this.token = ''
    }

  }


  // Modal Code

  open() {
    this.dialog.open(AuthComponent, {
      width: '700px',
      maxWidth: '700px',
      height: '70%',
      autoFocus: false,
    });
  }
}

const GET_ALL_NOTIFICATION = gql`subscription{
  getChatMessageNotificationData{
    notifications{
      senderId
      senderName
      profileUrl
      sendAt
      content
      count
    }
    totalCount
    userId
  }
}`