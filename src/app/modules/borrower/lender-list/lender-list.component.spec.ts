import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderListComponent } from './lender-list.component';

describe('LenderListComponent', () => {
  let component: LenderListComponent;
  let fixture: ComponentFixture<LenderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LenderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
