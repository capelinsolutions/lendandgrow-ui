import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LenderComponent } from './lender.component';
import { LenderRoutingModule } from './lender-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileComponent } from './profile/profile.component';
import {MatListModule} from '@angular/material/list';
import { BorrowerListComponent } from './borrower-list/borrower-list.component';
import { BorrowerDetailsComponent } from './borrower-details/borrower-details.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { GraphqlModule } from 'src/app/graphql/graphql.module';
import { PropertyListComponent } from './property-list/property-list.component';
export const MY_FORMATS = {
  parse: {
      dateInput: 'LL'
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};

@NgModule({
  declarations: [
    LenderComponent,
    ProfileComponent,
    BorrowerListComponent,
    BorrowerDetailsComponent,
    CompleteProfileComponent,
    PropertyListComponent
  ],
  imports: [
    CommonModule,
    LenderRoutingModule,
    SharedModule,
    MatTabsModule,
    MatIconModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    GraphqlModule
  ],
  providers: [  
    MatDatepickerModule,  
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LenderModule { }
