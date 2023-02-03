import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { MainCardComponent } from './main-card/main-card.component';
import { HistoryCardComponent } from './history-card/history-card.component';
import { ProfileComponent } from './profile/profile.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { ChatComponent } from './chat/chat.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import { UserLandingScreenComponent } from './user-landing-screen/user-landing-screen.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { MaterialModule } from '../modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
  declarations: [
    NavbarComponent,
    LandingScreenComponent,
    BreadcrumbsComponent,
    MainCardComponent,
    HistoryCardComponent,
    ProfileComponent,
    PropertyCardComponent,
    ChatComponent,
    UserLandingScreenComponent,
    TagInputComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
    FlexLayoutModule,
    MatSidenavModule,
    MaterialModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule
  ],
  exports: [
    NavbarComponent,
    LandingScreenComponent,
    BreadcrumbsComponent,
    MainCardComponent,
    HistoryCardComponent,
    ProfileComponent,
    PropertyCardComponent,
    UserLandingScreenComponent,
  ]
})
export class SharedModule { }