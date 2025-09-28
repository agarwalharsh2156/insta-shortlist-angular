import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, LoginRequest } from './api.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private apiService: ApiService) { }

  login(credentials: LoginRequest): Observable<boolean> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        // Store token if present - Using sessionStorage for auto-logout on tab close
        if (response.token) {
          sessionStorage.setItem('authToken', response.token);
        }

        // Store user data if present
        if (response.user) {
          sessionStorage.setItem('userData', JSON.stringify(response.user));
        }

        sessionStorage.setItem('isLoggedIn', 'true');
        this.isLoggedInSubject.next(true);
      }),
      map(() => true)
    );
  }

  logout() {
    // Clear all session data
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('isLoggedIn');
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = sessionStorage.getItem('authToken');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    return !!(token && isLoggedIn);
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  getUserData(): any {
    const userData = sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Method to clear stale authentication data
  clearAuthState(): void {
    this.logout();
  }
}
