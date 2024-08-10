import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  Auth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const user = this.auth.currentUser;

    if (user && this.password) {
      // If the user is logged in, you may skip re-authentication with email and just update the password
      updatePassword(user, this.password)
        .then(() => {
          alert('Password updated successfully');
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.error('Error updating password:', error);
          alert('Failed to update password: ' + error.message);
        });
    } else {
      alert('Please fill in all fields.');
    }
  }
}
