import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileComponent } from '../profile/profile';

@Component({
  selector: 'app-navbar',
  imports: [ProfileComponent],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  authService = inject(AuthService);
  profileOpen = signal(false);

  toggleProfile(): void {
    this.profileOpen.update((v) => !v);
  }

  closeProfile(): void {
    this.profileOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
