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

  constructor(private apiService: ApiService) {}

  login(credentials: LoginRequest): Observable<boolean> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        // Store token if present
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        // Store user data if present
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
        }
        localStorage.setItem('isLoggedIn', 'true');
        this.isLoggedInSubject.next(true);
      }),
      map(() => true)
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken() || this.isLoggedInSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return !!(token && isLoggedIn);
  }
}