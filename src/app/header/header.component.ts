import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

declare global {
  interface Window {
    require: any;
    process: any;
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() refreshPage = new EventEmitter<void>();

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private router: Router
  ) {}

  onRefreshPage() {
    this.refreshPage.emit();
  }

  async onLogout() {
    try {
      this.authService.clearSubscriptions();
      await this.auth.signOut();
      console.log('User signed out successfully');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
