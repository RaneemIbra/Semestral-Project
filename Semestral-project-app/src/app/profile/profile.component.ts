import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Storage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from '@angular/fire/storage';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
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
    const authUser = this.auth.currentUser;
    if (authUser) {
      const uid = authUser.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data['profilePicUrl']) {
              // Correct access
              this.profilePicUrl = of(
                `${data['profilePicUrl']}?${new Date().getTime()}`
              );
            }
          }
        })
        .catch((error) => {
          console.error('Error loading profile picture:', error);
        });
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
      const authUser = this.auth.currentUser;
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
            await this.updateProfilePicInDB(uid, downloadURL);
            // Update the observable with the new URL immediately
            this.profilePicUrl = of(`${downloadURL}?${new Date().getTime()}`);
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

      // Check if the document exists
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        // If the document exists, update it
        await updateDoc(userDocRef, { profilePicUrl: downloadURL });
      } else {
        // If the document does not exist, create it with the profilePicUrl
        await setDoc(userDocRef, { profilePicUrl: downloadURL });
      }
    } catch (error) {
      console.error('Error updating profile picture URL in Firestore:', error);
      alert('Failed to update profile picture in database.');
    }
  }
}
