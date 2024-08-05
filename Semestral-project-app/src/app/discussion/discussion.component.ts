import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DiscussionBoxComponent } from './discussion-box/discussion-box.component';
import { CommonModule } from '@angular/common';
import { discussionBox } from './discussion-box/discussion-box.model';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [DiscussionBoxComponent, CommonModule],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css',
})
export class DiscussionComponent {
  constructor(private router: Router) {}

  navigateToPreview(title: string): void {
    this.router.navigate(['/discussionPreview', title]);
  }
}
