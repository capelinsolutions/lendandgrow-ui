import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthServiceGuard } from "src/app/services/auth/auth-service.guard";
import { ChatComponent } from "src/app/shared/chat/chat.component";
import { UserLandingScreenComponent } from "src/app/shared/user-landing-screen/user-landing-screen.component";
import { HistoryComponent } from "../borrower/history/history.component";
import { PropertyDetailsComponent } from "../borrower/property-details/property-details.component";
import { PropertyListComponent } from "../lender/property-list/property-list.component";
import { BorrowerDetailsComponent } from "./borrower-details/borrower-details.component";
import { BorrowerListComponent } from "./borrower-list/borrower-list.component";
// import { DealsComponent } from "./deals/deals.component";
import { LenderComponent } from "./lender.component";
import { ProfileComponent } from "./profile/profile.component";


export const routes: Routes = [
    {
      path: '',
      component: LenderComponent,
      children:[
        {
          path: '',
          redirectTo: '/lender/borrower/list',
          pathMatch: 'full'
        },
        {
            path: 'lender/borrower/list',
            component: BorrowerListComponent,
            canActivate: [AuthServiceGuard],
            data:{
              id: '624e7c99007730778c60baeb'
            }
        },
        {
          path: 'lender/property/list',
          component: PropertyListComponent,
          canActivate: [AuthServiceGuard],
          data:{
            id: '624e7c99007730778c60baeb'
          }
      },
      {
        path: 'lender/property/list/:id',
        pathMatch: 'full',
        component: PropertyDetailsComponent,
        canActivate: [AuthServiceGuard],
          data:{
            id: '624e7c99007730778c60baeb'
          }
      },
        {
          path: 'lender/borrower/list/:id',
          pathMatch: 'full',
          component: BorrowerDetailsComponent,
          canActivate: [AuthServiceGuard],
            data:{
              id: '624e7c99007730778c60baeb'
            }
        },
        {
          path: 'lender/borrower/list/:id/properties',
          pathMatch: 'full',
          component: PropertyListComponent,
          canActivate: [AuthServiceGuard],
            data:{
              id: '624e7c99007730778c60baeb'
            }
        },
        {
          path:'lender/borrower/list/:id/chat/:userId',
          component: ChatComponent,
          canActivate: [AuthServiceGuard],
              data:{
                id: '624e7c99007730778c60baeb'
              }
        },
        {
          path: 'lender/borrower/list/:id/:id',
          pathMatch: 'full',
          component: PropertyDetailsComponent,
          canActivate: [AuthServiceGuard],
            data:{
              id: '624e7c99007730778c60baeb'
            }
        },
        {
          path: 'lender/borrower/list/:id/properties/:id',
          pathMatch: 'full',
          component: PropertyDetailsComponent,
          canActivate: [AuthServiceGuard],
            data:{
              id: '624e7c99007730778c60baeb'
            }
        },
        {
          path: 'lender/profile',
          component: ProfileComponent,
          canActivate: [AuthServiceGuard],
            data:{
              id: '624e7c99007730778c60baeb'
            }
        },
        {
          path: 'lender/history',
          component: HistoryComponent,
          canActivate: [AuthServiceGuard],
            data:{
              id: '624e7c99007730778c60baeb'
            }
      },
      {
        path: 'lender/dashboard',
        component: UserLandingScreenComponent,
        canActivate: [AuthServiceGuard],
          data:{
            id: '624e7c99007730778c60baeb'
          }
      },
      {
        path: 'lender/borrower/list/:id/property/:id',
        component: PropertyDetailsComponent,
      },
      {
        path: 'lender/chat',
        component: ChatComponent,
      },
      
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class LenderRoutingModule { }