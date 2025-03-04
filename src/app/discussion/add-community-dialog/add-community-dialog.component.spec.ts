import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommunityDialogComponent } from './add-community-dialog.component';

describe('AddCommunityDialogComponent', () => {
  let component: AddCommunityDialogComponent;
  let fixture: ComponentFixture<AddCommunityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCommunityDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCommunityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
