// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environment/environment';

// ============================================
// Interfaces matching FastAPI backend
// ============================================

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserCreate extends UserLogin {
  role: string;
}

export interface TokenResponse {
  access_token: string;
}

export interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Uses environment config
  
  // Signals for reactive state
  isLoggedIn = signal(this.hasValidToken());
  currentUser = signal<string | null>(this.getUserFromStorage());
  currentRole = signal<string | null>(this.getRoleFromStorage());
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenValidity();
  }

  /**
   * Login with credentials - calls FastAPI backend
   */
  login(username: string, password: string): Observable<TokenResponse> {
    this.loading.set(true);
    this.error.set(null);

    const loginData: UserLogin = { username, password };

    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, loginData).pipe(
      tap(response => {
        this.setAuthData(response.access_token);
        this.isLoggedIn.set(true);
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        const errorMessage = error.error?.detail || 'Login failed. Please try again.';
        this.error.set(errorMessage);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user - calls FastAPI backend
   */
  register(username: string, password: string, role: string = 'user'): Observable<TokenResponse> {
    this.loading.set(true);
    this.error.set(null);

    const registerData: UserCreate = { username, password, role };

    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/register`, registerData).pipe(
      tap(response => {
        this.setAuthData(response.access_token);
        this.isLoggedIn.set(true);
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        const errorMessage = error.error?.detail || 'Registration failed. Please try again.';
        this.error.set(errorMessage);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.currentRole.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get current user
   */
  getCurrentUser(): string | null {
    return this.currentUser();
  }

  /**
   * Get current user role
   */
  getCurrentRole(): string | null {
    return this.currentRole();
  }

  /**
   * Decode JWT token (without verification - for client-side only)
   */
  private decodeToken(token: string): DecodedToken | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    return decoded.exp * 1000 < Date.now();
  }

  /**
   * Store auth token and user data
   */
  private setAuthData(token: string): void {
    localStorage.setItem('auth_token', token);

    // Decode token to get user info
    const decoded = this.decodeToken(token);
    if (decoded) {
      localStorage.setItem('user_data', decoded.sub);
      localStorage.setItem('user_role', decoded.role);
      this.currentUser.set(decoded.sub);
      this.currentRole.set(decoded.role);
    }
  }

  /**
   * Check if valid token exists
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Check token validity on service init
   */
  private checkTokenValidity(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.logout();
    }
  }

  /**
   * Get user data from storage
   */
  private getUserFromStorage(): string | null {
    return localStorage.getItem('user_data');
  }

  /**
   * Get user role from storage
   */
  private getRoleFromStorage(): string | null {
    return localStorage.getItem('user_role');
  }
}