import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderCardComponent } from './lender-card.component';

describe('LenderCardComponent', () => {
  let component: LenderCardComponent;
  let fixture: ComponentFixture<LenderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LenderCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
