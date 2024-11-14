import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionBoxComponent } from './discussion-box.component';

describe('DiscussionBoxComponent', () => {
  let component: DiscussionBoxComponent;
  let fixture: ComponentFixture<DiscussionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
