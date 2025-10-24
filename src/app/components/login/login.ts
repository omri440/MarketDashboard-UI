// login.ts
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  form: FormGroup;
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  showRegister = signal(false);


  constructor(
    private fb: FormBuilder,
    public authService: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Handle login form submission
   */
onLogin(): void {
  if (this.form.invalid) {
    this.errorMessage.set('Please fill in all fields correctly');
    return;
  }

  const { username, password } = this.form.value;

  // Call login OR register based on mode
  if (this.showRegister()) {
    this.authService.register(username, password).subscribe({
      next: () => this.form.reset(),
      error: () => this.errorMessage.set(this.authService.error())
    });
  } else {
    this.authService.login(username, password).subscribe({
      next: () => this.form.reset(),
      error: () => this.errorMessage.set(this.authService.error())
    });
  }
}

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Get loading state from auth service
   */
  get isLoading(): boolean {
    return this.authService.loading();
  }

  /**
   * Get field error message
   */
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control.errors['minlength']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return 'Invalid input';
  }


  toggleRegisterMode(): void {
  this.showRegister.set(!this.showRegister());
  this.form.reset();
  this.errorMessage.set(null);
}


}