import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserFormData } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;

  @Input() set serverErrors(errs: { email?: string; phone?: string }) {
    if (errs.email) {
      const ctrl = this.form.get('email')!;
      ctrl.markAsTouched();
      ctrl.setErrors({ ...ctrl.errors, duplicate: errs.email });
    }
    if (errs.phone) {
      const ctrl = this.form.get('phone')!;
      ctrl.markAsTouched();
      ctrl.setErrors({ ...ctrl.errors, duplicate: errs.phone });
    }
  }

  @Output() save = new EventEmitter<UserFormData>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  readonly roles = ['Admin', 'Manager', 'User'] as const;
  readonly statuses = ['Active', 'Inactive'] as const;

  form = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9._-]+$/)],
    ],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+254[0-9]{9}$/)]],
    role: ['User', Validators.required],
    status: ['Active', Validators.required],
  });

  get isEdit(): boolean {
    return !!this.user;
  }

  ngOnInit(): void {
    if (this.user) {
      this.form.patchValue(this.user);
    }
    // Clear server duplicate error when the user types a new value
    this.form.get('email')!.valueChanges.subscribe(() => {
      const ctrl = this.form.get('email')!;
      if (ctrl.hasError('duplicate')) {
        const { duplicate, ...rest } = ctrl.errors ?? {};
        ctrl.setErrors(Object.keys(rest).length ? rest : null);
      }
    });
    this.form.get('phone')!.valueChanges.subscribe(() => {
      const ctrl = this.form.get('phone')!;
      if (ctrl.hasError('duplicate')) {
        const { duplicate, ...rest } = ctrl.errors ?? {};
        ctrl.setErrors(Object.keys(rest).length ? rest : null);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value as UserFormData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  fieldError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }

  fieldTouched(field: string): boolean {
    return !!this.form.get(field)?.invalid && !!this.form.get(field)?.touched;
  }
}
