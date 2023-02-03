import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSharedFileModalComponent } from './edit-shared-file-modal.component';

describe('EditSharedFileModalComponent', () => {
  let component: EditSharedFileModalComponent;
  let fixture: ComponentFixture<EditSharedFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSharedFileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSharedFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
