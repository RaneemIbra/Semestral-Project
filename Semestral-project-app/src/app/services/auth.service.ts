import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth-types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserId: string | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {
    authState(this.auth).subscribe((user: User | null) => {
      if (user) {
        this.currentUserId = user.uid;
      } else {
        this.currentUserId = null;
      }
    });
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  getUserData(userId: string): Observable<any> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef);
  }
}
