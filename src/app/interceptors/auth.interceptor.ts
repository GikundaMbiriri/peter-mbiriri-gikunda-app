import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

/** Endpoints that never need an Authorization header */
const PUBLIC_URLS = ['/api/auth/login', '/api/auth/refresh'];

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (PUBLIC_URLS.includes(req.url)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  // Token is near/past expiry — proactively refresh before sending the request
  if (authService.isTokenExpired(token, environment.tokenExpiryBufferSeconds)) {
    return authService.refresh().pipe(
      switchMap((res) => next(addToken(req, res.token))),
      catchError(() => {
        authService.logout();
        return throwError(() => new Error('Session expired. Please log in again.'));
      }),
    );
  }

  // Token is valid — attach it and handle any 401 response reactively
  return next(addToken(req, token)).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return authService.refresh().pipe(
          switchMap((res) => next(addToken(req, res.token))),
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
