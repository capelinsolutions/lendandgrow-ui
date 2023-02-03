import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerDetailsComponent } from './borrower-details.component';

describe('BorrowerDetailsComponent', () => {
  let component: BorrowerDetailsComponent;
  let fixture: ComponentFixture<BorrowerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
