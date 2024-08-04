import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionPreviewComponent } from './discussion-preview.component';

describe('DiscussionPreviewComponent', () => {
  let component: DiscussionPreviewComponent;
  let fixture: ComponentFixture<DiscussionPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
