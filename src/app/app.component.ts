import { OtpComponent } from './modules/auth/otp/otp.component';
import { AuthComponent } from './modules/auth/auth.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private apollo: Apollo, private modal: MatDialog) {}
  title = 'hardmoneylending';
  ngOnInit(): void {
 }
}
