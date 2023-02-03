import { FolderDetailComponent } from './folder-detail/folder-detail.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';
import { HistoryComponent } from './history/history.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BorrowerComponent } from './borrower.component';
import { ProfileComponent } from './profile/profile.component';
import { BorrowerGeneralProfileComponent } from './borrower-general-profile/borrower-general-profile.component';
import { ChatComponent } from 'src/app/shared/chat/chat.component';
import { LenderListComponent } from './lender-list/lender-list.component';
import { LenderDetailsComponent } from './lender-details/lender-details.component';
import { UploadPropertyComponent } from './upload-property/upload-property.component';
import { AuthServiceGuard } from 'src/app/services/auth/auth-service.guard';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { UserLandingScreenComponent } from 'src/app/shared/user-landing-screen/user-landing-screen.component';

export const routes: Routes = [
  {
    path: '',
    component: BorrowerComponent,
    children: [
      {
        path: '',
        redirectTo: '/borrower/lender/list',
        pathMatch: 'full',
      },
      {
        path: 'borrower/lender/list',
        component: LenderListComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path: 'borrower/lender/profile',
        component: ProfileComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path: 'borrower/lender/list/:id',
        pathMatch: 'full',
        component: LenderDetailsComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path: 'borrower/documents',
        component: MyDocumentsComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path: 'borrower/history',
        component: HistoryComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path: 'borrower/history/:id',
        component: BorrowerGeneralProfileComponent,
        canActivate: [AuthServiceGuard],
      },
      {
        path:'folder/:folderId',
        component: FolderDetailComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path:'borrower/lender/list/:id/chat/:userId',
        component: ChatComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path:'borrower/profile',
        component: ProfileComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path:'borrower/profile/property',
        component: PropertyListComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path:'borrower/profile/property/uploadProperty',
        component: UploadPropertyComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path:'borrower/profile/property/:id',
        component: PropertyDetailsComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      {
        path:'borrower/profile/:id',
        component: PropertyDetailsComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      
      {
        path:'borrower/profile/:id/uploadProperty',
        component: UploadPropertyComponent,
        canActivate: [AuthServiceGuard],
            data:{
              id: '62129e6f7596dc5d3251fc6b'
            }
      },
      
      // {
      //   path:'borrower/properties',
      //   component: DealsComponent,
      //   canActivate: [AuthServiceGuard],
      //       data:{
      //         id: '62129e6f7596dc5d3251fc6b'
      //       }
      // },
      
      {
        path: 'borrower/dashboard',
        component: UserLandingScreenComponent,
        canActivate: [AuthServiceGuard],
        data:{
          id: '62129e6f7596dc5d3251fc6b'
        }
      },
      {
        path: 'borrower/chat',
        component: ChatComponent,
      },
      
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrowerRoutingModule {}
