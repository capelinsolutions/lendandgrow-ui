import { NgxSpinnerModule } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BorrowerComponent } from './signup/borrower/borrower.component';
import { LenderComponent } from './signup/lender/lender.component';
import { OtpComponent } from './otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ToastrModule } from 'ngx-toastr';
import { ResetScreenComponent } from './reset-screen/reset-screen.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AuthComponent,
    BorrowerComponent,
    LenderComponent,
    OtpComponent,
    ForgotPasswordComponent,
    ResetScreenComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    NgOtpInputModule,
    MatStepperModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    NgxSpinnerModule,
    SharedModule,
    ToastrModule.forRoot()
  ]
})
export class AuthModule { }
