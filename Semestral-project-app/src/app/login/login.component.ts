import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  onSignUp() {
    const signUpBtn = this.el.nativeElement.querySelector(
      '.sign-up .Sign'
    ) as HTMLButtonElement;
    signUpBtn.disabled = true;

    const email = (
      this.el.nativeElement.querySelector(
        '.sign-up input[type="email"]'
      ) as HTMLInputElement
    ).value;
    const password = (
      this.el.nativeElement.querySelector(
        '.sign-up input[type="password"]'
      ) as HTMLInputElement
    ).value;
    const name = (
      this.el.nativeElement.querySelector(
        '.sign-up input[type="text"]'
      ) as HTMLInputElement
    ).value;

    if (email && password && name) {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          setDoc(userDocRef, { name, email });
          const container = this.el.nativeElement.querySelector('#container');
          this.renderer.removeClass(container, 'active');
          alert('Successfully signed up!');
        })
        .catch((error) => {
          console.error('Error during sign up:', error);
          alert('Sign up failed: ' + error.message);
        })
        .finally(() => {
          signUpBtn.disabled = false;
        });
    } else {
      alert('Please fill in all fields.');
      signUpBtn.disabled = false;
    }
  }

  onSignIn() {
    const email = (
      this.el.nativeElement.querySelector(
        '.sign-in input[type="email"]'
      ) as HTMLInputElement
    ).value;
    const password = (
      this.el.nativeElement.querySelector(
        '.sign-in input[type="password"]'
      ) as HTMLInputElement
    ).value;

    if (email && password) {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Error during sign in:', error);
          alert('Sign in failed: ' + error.message);
        });
    } else {
      alert('Please fill in all fields.');
    }
  }

  toggleContainer() {
    const container = this.el.nativeElement.querySelector('#container');
    if (container.classList.contains('active')) {
      this.renderer.removeClass(container, 'active');
    } else {
      this.renderer.addClass(container, 'active');
    }
  }

  ngAfterViewInit() {}
}
