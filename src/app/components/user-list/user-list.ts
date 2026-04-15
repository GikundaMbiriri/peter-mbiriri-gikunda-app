import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Subject, switchMap } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { User, UserFormData } from '../../models/user.model';
import { UserFormComponent } from '../user-form/user-form';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-user-list',
  imports: [DatePipe, UserFormComponent, ConfirmDialogComponent],
  templateUrl: './user-list.html',
})
export class UserListComponent implements OnInit {
  private userSvc = inject(UserService);
  private alertSvc = inject(AlertService);
  private destroyRef = inject(DestroyRef);

  // State
  users = signal<User[]>([]);
  loading = signal(false);
  saving = signal(false);
  showUserForm = signal(false);
  selectedUser = signal<User | null>(null);
  userToDelete = signal<User | null>(null);
  searchQuery = signal('');
  formServerErrors = signal<{ email?: string; phone?: string }>({});

  // Pagination
  currentPage = signal(1);
  readonly pageSize = 10;
  totalCount = signal(0);
  totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize)));
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const pages: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  });

  // Server-side aggregate stats
  totalUsers = signal(0);
  activeUsers = signal(0);
  inactiveUsers = signal(0);
  adminCount = signal(0);

  private searchSubject = new Subject<{ query: string; page: number }>();

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => a.query === b.query && a.page === b.page),
        switchMap(({ query, page }) => {
          this.loading.set(true);
          return this.userSvc.getUsers(query, page, this.pageSize);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.users.set(res.data);
          this.totalCount.set(res.total ?? 0);
          this.totalUsers.set(res.total ?? 0);
          if (res.totalActive !== undefined) this.activeUsers.set(res.totalActive);
          if (res.totalInactive !== undefined) this.inactiveUsers.set(res.totalInactive);
          if (res.totalAdmins !== undefined) this.adminCount.set(res.totalAdmins);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.alertSvc.show('Failed to load users. Please try again.', 'error');
        },
      });

    this.searchSubject.next({ query: '', page: 1 });
  }

  onSearchChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.currentPage.set(1);
    this.searchSubject.next({ query: val, page: 1 });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.searchSubject.next({ query: '', page: 1 });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.searchSubject.next({ query: this.searchQuery(), page });
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }
  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  openCreateForm(): void {
    this.selectedUser.set(null);
    this.showUserForm.set(true);
  }

  openEditForm(user: User): void {
    this.selectedUser.set(user);
    this.showUserForm.set(true);
  }

  closeUserForm(): void {
    this.showUserForm.set(false);
    this.selectedUser.set(null);
    this.formServerErrors.set({});
  }

  openDeleteConfirm(user: User): void {
    this.userToDelete.set(user);
  }

  closeConfirmDialog(): void {
    this.userToDelete.set(null);
  }

  onUserSaved(data: UserFormData): void {
    this.saving.set(true);
    this.formServerErrors.set({});
    const user = this.selectedUser();

    const request$ = user ? this.userSvc.updateUser(user.id, data) : this.userSvc.createUser(data);

    request$.subscribe({
      next: (res) => {
        this.saving.set(false);
        this.closeUserForm();
        this.alertSvc.show(
          res.message ?? (user ? 'User updated successfully.' : 'User created successfully.'),
          'success',
        );
        this.searchSubject.next({ query: this.searchQuery(), page: this.currentPage() });
      },
      error: (err) => {
        this.saving.set(false);
        const message: string = err?.error?.message ?? 'Operation failed. Please try again.';
        if (err?.status === 409) {
          if (message.toLowerCase().includes('email')) {
            this.formServerErrors.set({ email: message });
          } else if (message.toLowerCase().includes('phone')) {
            this.formServerErrors.set({ phone: message });
          }
        }
        this.alertSvc.show(message, 'error');
      },
    });
  }

  onDeleteConfirmed(): void {
    const user = this.userToDelete();
    if (!user) return;

    this.closeConfirmDialog();
    this.userSvc.deleteUser(user.id).subscribe({
      next: (res) => {
        this.alertSvc.show(res.message ?? 'User deleted successfully.', 'success');
        // If last item on page, go back one
        const newTotal = this.totalCount() - 1;
        const maxPage = Math.max(1, Math.ceil(newTotal / this.pageSize));
        const page = Math.min(this.currentPage(), maxPage);
        this.currentPage.set(page);
        this.searchSubject.next({ query: this.searchQuery(), page });
      },
      error: (err) => {
        this.alertSvc.show(err?.error?.message ?? 'Failed to delete user.', 'error');
      },
    });
  }

  // ─── UI helpers ─────────────────────────────────────────────────────────────
  get pageStart(): number {
    return (this.currentPage() - 1) * this.pageSize + 1;
  }
  get pageEnd(): number {
    return Math.min(this.currentPage() * this.pageSize, this.totalCount());
  }

  avatarColor(user: User): string {
    const palette = ['#002C4D', '#7CC142', '#1a6bb5', '#e07b15', '#8b5cf6', '#0891b2', '#be185d'];
    const idx = (user.firstName.charCodeAt(0) + user.lastName.charCodeAt(0)) % palette.length;
    return palette[idx];
  }

  roleBadgeClass(role: User['role']): string {
    const map: Record<string, string> = {
      Admin: 'badge-navy',
      Manager: 'badge-blue',
      User: 'badge-gray',
    };
    return map[role] ?? 'badge-gray';
  }

  statusBadgeClass(status: User['status']): string {
    return status === 'Active' ? 'badge-green' : 'badge-red';
  }

  trackByUser(_: number, user: User): string {
    return user.id;
  }
}
