import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DiscussionBoxComponent } from './discussion-box/discussion-box.component';
import { CommonModule } from '@angular/common';
import { AddCommunityDialogComponent } from './add-community-dialog/add-community-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  Unsubscribe,
  where,
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
  userCanEdit: boolean = false;
  private authStateSub!: Unsubscribe;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.loadCommunities();

    this.authStateSub = onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.checkUserPermissions(user.uid);
      } else {
        this.userCanEdit = false;
        this.router.navigate(['/login']);
      }
    });
  }

  async checkUserPermissions(userId: string) {
    try {
      const userDocRef = doc(this.firestore, `users/${userId}`);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        this.userCanEdit = userData['modify'] || false;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.authStateSub) {
      this.authStateSub();
    }
  }

  navigateToPreview(title: string): void {
    this.router.navigate(['/discussionPreview', title]);
  }

  openAddCommunityDialog(): void {
    const dialogRef = this.dialog.open(AddCommunityDialogComponent);

    dialogRef.afterClosed().subscribe((communityName) => {
      if (communityName) {
        this.checkIfCommunityExists(communityName).then((exists) => {
          if (exists) {
            alert(
              'A community with this name already exists. Please choose a different name.'
            );
          } else {
            this.communities.push({
              title: communityName,
              icon: 'fa-new-icon',
            });

            this.addCommunityToFirestore(communityName);
          }
        });
      }
    });
  }

  async checkIfCommunityExists(communityName: string): Promise<boolean> {
    const communityCollection = collection(this.firestore, 'communities');
    const q = query(communityCollection, where('title', '==', communityName));

    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
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
