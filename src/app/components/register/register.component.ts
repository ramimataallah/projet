import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.error = null;
    this.loading = true;
    this.auth.register(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/news']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message || 'Registration failed';
      }
    });
  }
}
