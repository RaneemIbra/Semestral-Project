import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { User } from '@firebase/auth-types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserId: string | null = null;
  public authState$: Observable<User | null>;
  private subscriptions: Subscription[] = [];

  constructor(private auth: Auth, private firestore: Firestore) {
    this.authState$ = authState(this.auth);

    this.authState$.subscribe((user: User | null) => {
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

  trackSubscription(sub: Subscription) {
    this.subscriptions.push(sub);
  }

  clearSubscriptions() {
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
    this.subscriptions = [];
  }
}
