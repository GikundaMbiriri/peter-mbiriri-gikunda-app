import { Component, inject } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { Toast } from '../../models/auth.model';

@Component({
  selector: 'app-alert-toast',
  templateUrl: './alert-toast.html',
})
export class AlertToastComponent {
  alertSvc = inject(AlertService);

  dismiss(id: number): void {
    this.alertSvc.dismiss(id);
  }

  toastClasses(type: Toast['type']): string {
    const map: Record<Toast['type'], string> = {
      success: 'bg-white border-l-4 border-kcb-green text-gray-800',
      error: 'bg-white border-l-4 border-red-500 text-gray-800',
      warning: 'bg-white border-l-4 border-amber-500 text-gray-800',
      info: 'bg-white border-l-4 border-blue-500 text-gray-800',
    };
    return map[type];
  }

  iconPath(type: Toast['type']): string {
    const icons: Record<Toast['type'], string> = {
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      warning:
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    };
    return icons[type];
  }

  iconColor(type: Toast['type']): string {
    const map: Record<Toast['type'], string> = {
      success: 'text-kcb-green',
      error: 'text-red-500',
      warning: 'text-amber-500',
      info: 'text-blue-500',
    };
    return map[type];
  }
}
