import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

type TabType = 'account' | 'email' | 'password' | 'security';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="profile-page">
      <!-- Hero Header -->
      <div class="profile-hero">
        <div class="hero-content">
          <h1>Account Settings</h1>
          <p>Keep your account secure and up to date</p>
        </div>
      </div>

      <!-- Main Container -->
      <div class="profile-container">
        <!-- Tab Navigation -->
        <div class="tabs-nav">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'account'"
            (click)="activeTab = 'account'">
            <span class="tab-icon">👤</span> Account
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'email'"
            (click)="activeTab = 'email'">
            <span class="tab-icon">✉️</span> Email
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'password'"
            (click)="activeTab = 'password'">
            <span class="tab-icon">🔐</span> Password
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tabs-content">
          <!-- Account Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'account'">
            <div class="content-card">
              <div class="card-header-slim">
                <h2>Account Information</h2>
              </div>
              <div class="card-body-slim">
                <div *ngIf="userEmail; else anon" class="account-info">
                  <div class="info-row">
                    <span class="label">Email Address</span>
                    <span class="value">{{ userEmail }}</span>
                  </div>
                </div>
                <ng-template #anon>
                  <div class="muted">No user information available.</div>
                </ng-template>
              </div>
            </div>
          </div>

          <!-- Email Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'email'">
            <div class="content-card">
              <div class="card-header-slim">
                <h2>Update Email Address</h2>
                <p>We'll send a verification link to confirm the change</p>
              </div>
              <div class="card-body-slim">
                <form [formGroup]="emailForm" (ngSubmit)="onUpdateEmail()">
                  <div class="form-group-custom">
                    <label for="email">New Email</label>
                    <input id="email" type="email" formControlName="email" placeholder="you@example.com" />
                  </div>
                  <button class="btn-modern btn-primary" type="submit" [disabled]="emailForm.invalid || emailLoading">
                    {{ emailLoading ? '⏳ Updating…' : '✓ Update Email' }}
                  </button>
                  <div *ngIf="emailSuccess" class="message success">
                    ✓ Email updated! Check your inbox for verification.
                  </div>
                  <div *ngIf="emailVerificationSent && !emailError" class="message info">
                    <div>Please verify your new email address.</div>
                    <button class="link-btn" type="button" (click)="onResendVerification()" [disabled]="resendLoading">
                      {{ resendLoading ? 'Resending…' : 'Resend verification' }}
                    </button>
                    <div *ngIf="resendSuccess" class="text-sm success-text">✓ Verification email sent!</div>
                  </div>
                  <div *ngIf="emailError" class="message error">{{ emailError }}</div>
                </form>
              </div>
            </div>
          </div>

          <!-- Password Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'password'">
            <div class="content-card">
              <div class="card-header-slim">
                <h2>Change Password</h2>
                <p>Keep your account secure with a strong password</p>
              </div>
              <div class="card-body-slim">
                <form [formGroup]="passwordForm" (ngSubmit)="onUpdatePassword()">
                  <div class="form-group-custom">
                    <label for="password">New Password</label>
                    <input id="password" type="password" formControlName="password" placeholder="Min 6 characters" />
                  </div>
                  <div class="form-group-custom">
                    <label for="confirm">Confirm Password</label>
                    <input id="confirm" type="password" formControlName="confirm" placeholder="Confirm new password" />
                  </div>
                  <button class="btn-modern btn-primary" type="submit" [disabled]="passwordForm.invalid || passwordLoading">
                    {{ passwordLoading ? '⏳ Updating…' : '✓ Update Password' }}
                  </button>
                  <div *ngIf="passwordSuccess" class="message success">✓ Password updated successfully!</div>
                  <div *ngIf="passwordError" class="message error">{{ passwordError }}</div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Logout Section -->
        <div class="logout-section">
          <button class="btn-modern btn-logout" (click)="onLogout()">
            🚪 Sign Out
          </button>
        </div>
      </div>

      <!-- Re-auth Modal -->
      <div *ngIf="showReauth" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header-custom">
            <h3>Verify Your Identity</h3>
            <button class="close-btn" (click)="showReauth = false" [disabled]="reauthLoading">×</button>
          </div>
          <div class="modal-body-custom">
            <p>For your security, please enter your current password.</p>
            <form [formGroup]="reauthForm" (ngSubmit)="onReauthenticate()">
              <div class="form-group-custom">
                <label for="reauth-pwd">Current Password</label>
                <input id="reauth-pwd" type="password" formControlName="password" placeholder="••••••••" />
              </div>
              <div class="modal-actions-custom">
                <button class="btn-modern btn-primary" type="submit" [disabled]="reauthForm.invalid || reauthLoading">
                  {{ reauthLoading ? 'Verifying…' : 'Verify' }}
                </button>
                <button class="btn-modern btn-secondary" type="button" (click)="showReauth = false" [disabled]="reauthLoading">
                  Cancel
                </button>
              </div>
              <div *ngIf="reauthError" class="message error">{{ reauthError }}</div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userEmail: string | null = null;
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  activeTab: TabType = 'account';

  emailLoading = false;
  emailError: string | null = null;
  emailSuccess = false;
  emailVerificationSent = false;
  resendLoading = false;
  resendSuccess = false;
  resendError: string | null = null;

  passwordLoading = false;
  passwordError: string | null = null;
  passwordSuccess = false;

  // re-auth flow
  showReauth = false;
  reauthForm!: FormGroup;
  reauthLoading = false;
  reauthError: string | null = null;

  // pending action when reauth required
  private pendingAction: 'email' | 'password' | null = null;
  private pendingPayload: any = null;

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {
    this.auth.user$.subscribe((u: any) => (this.userEmail = u?.email || null));
    // initialize forms here to avoid using `fb` before constructor runs
    this.emailForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
    this.passwordForm = this.fb.group({ password: ['', [Validators.required, Validators.minLength(6)]], confirm: ['', Validators.required] });
    this.reauthForm = this.fb.group({ password: ['', Validators.required] });
  }

  onLogout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

  onUpdateEmail() {
    if (this.emailForm.invalid) return;
    this.emailError = null;
    this.emailSuccess = false;
    this.emailLoading = true;
    const newEmail = this.emailForm.value.email;

    this.auth.updateEmail(newEmail).subscribe({
        next: () => {
          this.emailLoading = false;
          this.emailSuccess = true;
          // update local display
          this.userEmail = newEmail;
          // because AuthService chains sendEmailVerification, assume it was sent
          this.emailVerificationSent = true;
        },
        error: (err: any) => {
          console.error('debug updateEmail error', err);
          this.emailLoading = false;
          const code = err?.code || '';
          const msg = err?.message || String(err);
          if (code === 'auth/requires-recent-login' || msg.toLowerCase().includes('recent')) {
            // require reauthentication
            this.pendingAction = 'email';
            this.pendingPayload = newEmail;
            this.showReauth = true;
            this.reauthError = null;
            return;
          }
          // handle operation-not-allowed (provider disabled) with friendly message
          if (code === 'auth/operation-not-allowed' || msg.toLowerCase().includes('operation-not-allowed')) {
            this.emailError = 'Email/password authentication is disabled in Firebase console. Enable it under Authentication → Sign-in method.';
            return;
          }
          // If update succeeded but verification email was sent, Firebase will not throw —
          // however if the chained sendEmailVerification fails, surface that message.
          this.emailError = msg;
        }
    });
  }

  onResendVerification() {
    this.resendLoading = true;
    this.resendError = null;
    this.resendSuccess = false;
    this.auth.sendVerificationEmail().subscribe({
      next: () => {
        this.resendLoading = false;
        this.resendSuccess = true;
        this.emailVerificationSent = true;
      },
      error: (err: any) => {
        console.error('debug resend verification error', err);
        this.resendLoading = false;
        this.resendError = err?.message || String(err);
      }
    });
  }

  onUpdatePassword() {
    if (this.passwordForm.invalid) return;
    const pw = this.passwordForm.value.password;
    const confirm = this.passwordForm.value.confirm;
    if (pw !== confirm) {
      this.passwordError = 'Passwords do not match';
      return;
    }
    this.passwordError = null;
    this.passwordSuccess = false;
    this.passwordLoading = true;
    this.auth.updatePassword(pw).subscribe({
      next: () => {
        this.passwordLoading = false;
        this.passwordSuccess = true;
        this.passwordForm.reset();
      },
      error: (err: any) => {
        console.error('debug updatePassword error', err);
        this.passwordLoading = false;
        const code = err?.code || '';
        const msg = err?.message || String(err);
        if (code === 'auth/requires-recent-login' || msg.toLowerCase().includes('recent')) {
          this.pendingAction = 'password';
          this.pendingPayload = pw;
          this.showReauth = true;
          this.reauthError = null;
          return;
        }
        this.passwordError = msg;
      }
    });
  }

  onReauthenticate() {
    if (this.reauthForm.invalid) return;
    this.reauthLoading = true;
    this.reauthError = null;
    const pwd = this.reauthForm.value.password;
    this.auth.reauthenticate(pwd).subscribe({
      next: () => {
        this.reauthLoading = false;
        this.showReauth = false;
        // retry pending action
        if (this.pendingAction === 'email') {
          const email = this.pendingPayload;
          this.pendingAction = null;
          this.pendingPayload = null;
          // call updateEmail and surface results to UI
          this.emailLoading = true;
          this.auth.updateEmail(email).subscribe({
            next: () => {
              this.emailLoading = false;
              this.emailSuccess = true;
              this.userEmail = email;
            },
            error: (e: any) => {
              this.emailLoading = false;
              this.emailError = e?.message || String(e);
            }
          });
        } else if (this.pendingAction === 'password') {
          const pw = this.pendingPayload;
          this.pendingAction = null;
          this.pendingPayload = null;
          this.passwordLoading = true;
          this.auth.updatePassword(pw).subscribe({
            next: () => {
              this.passwordLoading = false;
              this.passwordSuccess = true;
              this.passwordForm.reset();
            },
            error: (e: any) => {
              this.passwordLoading = false;
              this.passwordError = e?.message || String(e);
            }
          });
        }
        this.reauthForm.reset();
      },
      error: (err: any) => {
        console.error('debug reauthenticate error', err);
        this.reauthLoading = false;
        this.reauthError = err?.message || String(err);
      }
    });
  }
}
