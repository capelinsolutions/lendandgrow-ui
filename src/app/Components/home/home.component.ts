import { ApplicationRef, ChangeDetectorRef, Component, OnChanges, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeScreenComponent implements OnInit {
  id: any =true;
  loggedIn: any = false;
  constructor(private _authService:AuthServiceService,private ref: ChangeDetectorRef,private router: Router) { }
 
  ngOnInit(): void {
    this.getId();
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  getId(){
    this._authService.isLoggedIn.subscribe((res) => {
      this.loggedIn = res;
      this.ref.detectChanges();
    this.ref.markForCheck();
      this.router.navigate(['/']);
    });

    let id=localStorage.getItem('RoleId');
    if(id!=null){
      this.loggedIn = true;
      this.id=false;
      this.ref.detectChanges();
    this.ref.markForCheck();
    }
    else{
      this.loggedIn = false;
      this.id=true;
      this.ref.detectChanges();
      this.ref.markForCheck();
    }
  }

}
