import { Component, OnInit } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  Storage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  selectedFile: File | null = null;
  profilePicUrl: Observable<string | null> | undefined;

  constructor(
    private auth: Auth,
    private storage: Storage,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.loadProfilePic();
  }

  loadProfilePic() {
    const authUser = user(this.auth);
    if (authUser) {
      const uid = authUser.uid;
      const storageRef = ref(this.storage, `profilePictures/${uid}`);
      this.profilePicUrl = from(getDownloadURL(storageRef));
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  async onUpload() {
    if (this.selectedFile) {
      const authUser = user(this.auth);
      if (authUser) {
        const uid = authUser.uid;
        const storageRef = ref(this.storage, `profilePictures/${uid}`);
        const uploadTask = uploadBytesResumable(storageRef, this.selectedFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Handle progress, e.g., show a progress bar
          },
          (error) => {
            console.error('Error uploading file:', error);
            alert('Failed to upload profile picture.');
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            this.updateProfilePicInDB(uid, downloadURL);
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
      alert('Profile picture updated successfully!');
      this.loadProfilePic(); // Refresh the profile picture
    } catch (error) {
      console.error('Error updating profile picture URL in Firestore:', error);
      alert('Failed to update profile picture in database.');
    }
  }
}
