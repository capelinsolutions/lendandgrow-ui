import { AuthComponent } from './../../modules/auth/auth.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.scss'],
})
export class LandingScreenComponent implements OnInit {
  constructor(private dialog: MatDialog) {}
  borrowerLenderItem: any ={
    name: "Lender List",
    url: "/borrower/lender/list"
  }
  lenderBorrowerItem: any ={
    name: "Borrower List",
    url: "/lender/borrower/list"
  }
  Role: any = ""
  item: any = []
  ngOnInit(): void {
    this.Role=localStorage.getItem("RoleId");
    if(this.Role==="624e7c99007730778c60baeb"){
      this.item=this.lenderBorrowerItem;
    }
    else{
      this.item=this.borrowerLenderItem;
    }
    setTimeout(() => {
      var navbar = document.querySelector('.navbar-container') as HTMLElement;
      navbar.classList.add('remove-bg-color');
    }, 10);
    console.log(window.innerHeight);
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll(e) {
    var navbar = document.querySelector('.navbar-container') as HTMLElement;
    console.log(window.pageYOffset);
    if (window.pageYOffset > 50) {
      navbar.classList.remove('remove-bg-color');
      navbar.classList.add('shadow-sm');
    } else {
      navbar.classList.add('remove-bg-color');
      navbar.classList.remove('shadow-sm');
    }

    // Your Code Here
  }

  open() {
    this.dialog.open(AuthComponent, {
      width: '700px',
      maxWidth: '700px',
      height: '70%',
      autoFocus: false,
    });
    // this.dialog.open(OtpComponent);
  }

  ngOnDestroy() {
    var navbar = document.querySelector('.navbar-container') as HTMLElement;
    navbar.classList.remove('remove-bg-color');
    navbar.classList.remove('shadow-sm');
  }
}
