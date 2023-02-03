import { DebugElement, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  // private isLoggedIn = new Subject<any>();
  // $isLoggedIn = this.isLoggedIn.asObservable();

  public isLoggedInSource = new BehaviorSubject<any>(!!localStorage.getItem('access_token'));
  isLoggedIn = this.isLoggedInSource.asObservable();

  private items = new Subject<any>();
  $items = this.items.asObservable();

  private dashboardItems = new Subject<any>();
  $dashboardItems = this.dashboardItems.asObservable();

  private navButton = new Subject<any>();
  $navButton = this.navButton.asObservable();

  private profileImage = new BehaviorSubject<any>("");
  $profileImage = this.profileImage.asObservable();


  public loggedIn: BehaviorSubject<any>;

  private userData = new BehaviorSubject<any>({});
  $userDdata = this.userData.asObservable();

  private userId = new BehaviorSubject<any>({});
  $userId = this.userData.asObservable();

  constructor(
    private router: Router,
    private _http: HttpClient
  ) {
  }


  // private _loginURL = environment._loginURL;
  private _loginUrlStep1 = environment._loginStep1;
  private _loginUrlStep2 = environment._loginStep2;


  // checkLoggedIn(data: any) {
  //   this.isLoggedIn.next(data)
  // }

  setItems(data: any) {
    this.items.next(data);
  }

  setDashboardItems(data: any) {
    this.dashboardItems.next(data);
  }

  setButton(data: any) {
    this.navButton.next(data);
  }

  setUserData(data: any) {
    this.userData.next(data);
  }

  setProfileImage(data: any){
    this.profileImage.next(data);
  }


  // public login(loginForm) {
  //   const headers = { 'Authorization': 'Basic Y2FsY2VydHM6dG9wc2VjcmV0' };
  //   return this._http.post(this._loginURL, loginForm, { headers: headers });
  // }

  public login(loginForm) {
    const headers = { 'Authorization': 'Basic Y2FsY2VydHM6dG9wc2VjcmV0' };
    return this._http.post(this._loginUrlStep1, loginForm, { headers: headers });
  }

  public loginStep2(loginForm){
    const headers = { 'Authorization': 'Basic Y2FsY2VydHM6dG9wc2VjcmV0' };
    return this._http.post(this._loginUrlStep2, loginForm, { headers: headers });
  }

}
