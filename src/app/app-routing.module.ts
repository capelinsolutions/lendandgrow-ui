import { HomeScreenComponent } from './Components/home/home.component';
import { LandingScreenComponent } from './shared/landing-screen/landing-screen.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthServiceGuard } from './services/auth/auth-service.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeScreenComponent,
    // children:[{

    // }]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'lender',
    loadChildren: () =>
      import('./modules/lender/lender.module').then((m) => m.LenderModule),
  },
  {
    path: 'borrower',
    loadChildren: () =>
      import('./modules/borrower/borrower.module').then(
        (m) => m.BorrowerModule
      ),
    
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthServiceGuard]
})
export class AppRoutingModule {}
