import { BorrowerModule } from './modules/borrower/borrower.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LenderModule } from './modules/lender/lender.module';
import { SharedModule } from './shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { HomeScreenComponent } from './Components/home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { GraphqlModule } from './graphql/graphql.module';
import { RouterModule } from '@angular/router';
import { routes } from './modules/borrower/borrower-routing.module';
@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ApolloModule,
    HttpClientModule,
    AuthModule,
    LenderModule,
    BorrowerModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    GraphqlModule,
    RouterModule.forRoot(routes,{scrollPositionRestoration: "enabled"}),

  ],

  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
