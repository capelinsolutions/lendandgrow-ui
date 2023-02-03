import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "./login/login.component";
import { ResetScreenComponent } from "./reset-screen/reset-screen.component";
import { SignupComponent } from "./signup/signup.component";

export const routes: Routes = [

  {
    path: 'forget-password',
      component: ResetScreenComponent,
  },
    {
      path: 'auth',
      component: AuthComponent,
      children:[
        {
          path: 'signup',
          component: SignupComponent
        },
        {
            path: 'login',
            component: LoginComponent
        },
  
      ],
      
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AuthRoutingModule { }