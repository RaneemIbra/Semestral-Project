import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DiscussionBoxComponent } from './discussion-box/discussion-box.component';
import { CommonModule } from '@angular/common';
import { discussionBox } from './discussion-box/discussion-box.model';
import { AddCommunityDialogComponent } from './add-community-dialog/add-community-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [
    MatDialogModule,
    DiscussionBoxComponent,
    CommonModule,
    AddCommunityDialogComponent,
  ],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css',
})
export class DiscussionComponent {
  communities: { title: string; icon: string }[] = [
    { title: 'General Discussion', icon: 'fa-comments' },
    { title: 'General Courses Discussion', icon: 'fa-book' },
    { title: 'Community Discussion', icon: 'fa-users' },
    { title: 'University Discussion', icon: 'fa-building-columns' },
  ];
  constructor(private router: Router, private dialog: MatDialog) {}

  navigateToPreview(title: string): void {
    this.router.navigate(['/discussionPreview', title]);
  }

  openAddCommunityDialog(): void {
    const dialogRef = this.dialog.open(AddCommunityDialogComponent);

    dialogRef.afterClosed().subscribe((communityName) => {
      console.log('Dialog closed, community name:', communityName);

      if (communityName) {
        this.communities.push({
          title: communityName,
          icon: 'fa-new-icon',
        });
      }
    });
  }
}
