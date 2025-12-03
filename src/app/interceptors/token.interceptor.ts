import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private auth = inject(Auth);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only attach token for API calls (adjust the condition as needed)
    if (!req.url.startsWith('http')) return next.handle(req);

    const current = (this.auth as any).currentUser;
    const tokenPromise = current ? current.getIdToken() : Promise.resolve(null);

    return from(tokenPromise).pipe(
      switchMap((token) => {
        if (token) {
          const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
    );
  }
}
