import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private router: Router) { }
  active: Number = 1;
  ngOnInit(): void {
    if (this.router.url.includes('signup')){
      this.active = 2
    } else {
      this.active = 1
    }
  }
  

  handleAuthButtonClick(type: Number) {
    this.active = type;
    if (type === 1) {
      this.router.navigate(['/auth/login']);
    } else if (type === 2) {
      this.router.navigate(['/auth/signup']);
    }
  }

}
