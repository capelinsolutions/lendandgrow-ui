import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLandingScreenComponent } from './user-landing-screen.component';

describe('UserLandingScreenComponent', () => {
  let component: UserLandingScreenComponent;
  let fixture: ComponentFixture<UserLandingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLandingScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLandingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
