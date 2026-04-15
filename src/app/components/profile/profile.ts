import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  readonly totalUsers = signal(0);
  readonly activeUsers = signal(0);
  readonly inactiveUsers = signal(0);

  get user() {
    return this.authService.currentUser();
  }

  get initials(): string {
    const name = this.user?.username ?? '';
    return name.slice(0, 2).toUpperCase();
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((res) => {
      const users: User[] = res.data;
      this.totalUsers.set(users.length);
      this.activeUsers.set(users.filter((u) => u.status === 'Active').length);
      this.inactiveUsers.set(users.filter((u) => u.status === 'Inactive').length);
    });
  }
}
