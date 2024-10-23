import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DiscussionBoxComponent } from './discussion-box/discussion-box.component';
import { CommonModule } from '@angular/common';
import { AddCommunityDialogComponent } from './add-community-dialog/add-community-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
export class DiscussionComponent implements OnInit {
  communities: { title: string; icon: string }[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  navigateToPreview(title: string): void {
    this.router.navigate(['/discussionPreview', title]);
  }

  openAddCommunityDialog(): void {
    const dialogRef = this.dialog.open(AddCommunityDialogComponent);

    dialogRef.afterClosed().subscribe((communityName) => {
      if (communityName) {
        this.communities.push({
          title: communityName,
          icon: 'fa-new-icon',
        });

        this.addCommunityToFirestore(communityName);
      }
    });
  }

  loadCommunities(): void {
    const communityCollection = collection(this.firestore, 'communities');

    getDocs(communityCollection)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data() as { title: string; icon: string };
          this.communities.push(data);
        });
      })
      .catch((error) => {
        console.error('Error fetching communities from Firestore:', error);
      });
  }

  addCommunityToFirestore(communityName: string): void {
    const communityCollection = collection(this.firestore, 'communities');

    addDoc(communityCollection, {
      title: communityName,
      icon: 'fa-new-icon',
    })
      .then(() => {
        console.log('Community added to Firestore successfully');
      })
      .catch((error) => {
        console.error('Error adding community to Firestore:', error);
      });
  }
}
