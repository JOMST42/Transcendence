import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case HttpStatusCode.BadRequest:
            this.toastService.showError(
              error.statusText + ' 🤫',
              error.error.message
            );
            break;
          case HttpStatusCode.Unauthorized:
            this.toastService.showError(
              error.status.toString(),
              error.statusText
            );
            break;
          case HttpStatusCode.NotFound:
            this.router.navigate(['not-found']);
            break;
          case HttpStatusCode.InternalServerError:
            this.router.navigate(['server-error']);
            break;
          default:
            break;
        }

        return throwError(() => error);
      })
    );
  }
}
