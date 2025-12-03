import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateEmail as fbUpdateEmail, updatePassword as fbUpdatePassword, reauthenticateWithCredential as fbReauthWithCredential, EmailAuthProvider, sendEmailVerification } from 'firebase/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  constructor(private auth: Auth) {
    // subscribe to AngularFire auth state (observable)
    authState(this.auth).subscribe((u) => this._user.next(u));
  }

  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth as unknown as any, email, password));
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth as unknown as any, email, password));
  }

  logout(): Observable<any> {
    return from(signOut(this.auth as unknown as any));
  }

  updateEmail(newEmail: string): Observable<any> {
    const current = (this.auth as unknown as any).currentUser as User | null;
    if (!current) return from(Promise.reject(new Error('No authenticated user')));
    // Try to update email, then send verification to the new address.
    return from((fbUpdateEmail as any)(current, newEmail)).pipe(
      switchMap(() => {
        // after update, currentUser should be the updated user
        const updated = (this.auth as unknown as any).currentUser as User | null;
        if (!updated) return from(Promise.resolve(null));
        return from((sendEmailVerification as any)(updated));
      })
    );
  }

  /** Send a verification email to the current user (if available). */
  sendVerificationEmail(): Observable<any> {
    const current = (this.auth as unknown as any).currentUser as User | null;
    if (!current) return from(Promise.reject(new Error('No authenticated user')));
    return from((sendEmailVerification as any)(current));
  }

  updatePassword(newPassword: string): Observable<any> {
    const current = (this.auth as unknown as any).currentUser as User | null;
    if (!current) return from(Promise.reject(new Error('No authenticated user')));
    return from((fbUpdatePassword as any)(current, newPassword));
  }

  /** Reauthenticate the current user using their email and current password. */
  reauthenticate(currentPassword: string): Observable<any> {
    const current = (this.auth as unknown as any).currentUser as User | null;
    if (!current) return from(Promise.reject(new Error('No authenticated user')));
    const email = (current as any).email as string | null;
    if (!email) return from(Promise.reject(new Error('No email available on user')));
    const cred = (EmailAuthProvider as any).credential(email, currentPassword);
    return from((fbReauthWithCredential as any)(current, cred));
  }

  // helper to get ID token for current user
  getIdToken(): Promise<string | null> {
    const current = (this.auth as unknown as any).currentUser as User | null;
    return current ? current.getIdToken() : Promise.resolve(null);
  }
}
