import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import {
  Storage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscussionBoxComponent } from '../discussion/discussion-box/discussion-box.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgIf, FormsModule, DiscussionBoxComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  selectedFile: File | null = null;
  detectiveBoardTitle: string = 'detective-board';
  private profilePicUrlSubject = new BehaviorSubject<string | null>(null);
  profilePicUrl = this.profilePicUrlSubject.asObservable();
  fullName: string = '';
  email: string = '';
  userAbout: string = '';
  isImageSelected: boolean = false;

  constructor(
    private auth: Auth,
    private storage: Storage,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadProfilePic();
    this.loadAboutInfo();
  }

  loadUserData() {
    const authUser = this.auth.currentUser;
    if (authUser) {
      this.email = authUser.email || '';

      const uid = authUser.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data['name']) {
              this.fullName = data['name'];
            }
          }
        })
        .catch((error) => {
          console.error('Error loading user data:', error);
        });
    }
  }

  loadProfilePic() {
    const authUser = this.auth.currentUser;
    if (authUser) {
      const uid = authUser.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data['profilePicUrl']) {
              this.profilePicUrlSubject.next(data['profilePicUrl']);
            }
          }
        })
        .catch((error) => {
          console.error('Error loading profile picture:', error);
        });
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('profilePicInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.isImageSelected = true;
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const authUser = this.auth.currentUser;
      if (authUser) {
        const uid = authUser.uid;
        const storageRef = ref(this.storage, `profilePictures/${uid}`);
        const uploadTask = uploadBytesResumable(storageRef, this.selectedFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Error uploading file:', error);
            alert('Failed to upload profile picture.');
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await this.updateProfilePicInDB(uid, downloadURL);
            this.profilePicUrlSubject.next(downloadURL);
            this.isImageSelected = false;
          }
        );
      }
    } else {
      alert('No file selected.');
    }
  }

  async updateProfilePicInDB(uid: string, downloadURL: string) {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, { profilePicUrl: downloadURL });
    } catch (error) {
      console.error('Error updating profile picture URL in Firestore:', error);
      alert('Failed to update profile picture in database.');
    }
  }

  loadAboutInfo() {
    const authUser = this.auth.currentUser;
    if (authUser) {
      const uid = authUser.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data['about']) {
              this.userAbout = data['about'];
            }
          }
        })
        .catch((error) => {
          console.error('Error loading user info:', error);
        });
    }
  }

  saveAbout() {
    const authUser = this.auth.currentUser;
    if (authUser) {
      const uid = authUser.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      updateDoc(userDocRef, { about: this.userAbout })
        .then(() => {
          alert('Information saved successfully!');
        })
        .catch((error) => {
          console.error('Error saving user info:', error);
          alert('Failed to save information.');
        });
    }
  }
}
