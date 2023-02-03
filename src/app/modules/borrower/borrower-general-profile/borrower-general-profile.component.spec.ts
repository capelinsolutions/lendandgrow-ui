import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerGeneralProfileComponent } from './borrower-general-profile.component';

describe('BorrowerGeneralProfileComponent', () => {
  let component: BorrowerGeneralProfileComponent;
  let fixture: ComponentFixture<BorrowerGeneralProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowerGeneralProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerGeneralProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
