import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 4500): void {
    const id = this.nextId++;
    this.toasts.update((ts) => [...ts, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update((ts) => ts.filter((t) => t.id !== id));
  }
}
