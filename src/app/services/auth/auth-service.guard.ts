import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegmentGroup, UrlTree } from '@angular/router';
import { Auth } from 'aws-amplify';
import { timeStamp } from 'console';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceGuard implements CanActivate {
  userTypeData: any;
  constructor(
    private router: Router,
    private auth: AuthServiceService,
    private _userService: UserService,
  ) { }
  isAllow: boolean =false;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url)
  }
 
  canLoad(
    route: Route,
    segments: UrlSegmentGroup[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  async checkUserLogin(route: ActivatedRouteSnapshot, url: any): Promise<boolean> {
    let currentUserTypeId: any;
    let authuser=localStorage.getItem("access_token");
    if(authuser) {
      currentUserTypeId=localStorage.getItem("RoleId");
        console.log(currentUserTypeId);
          if (route.data.id === currentUserTypeId) {
            console.log("yayyy both ids are same");
            return true;
          }
          else {
            this.router.navigate(['/home']);
            return false;
          }
    }
    else{
      this.router.navigate(['/home']);
    }
    return false;
  }
} 
