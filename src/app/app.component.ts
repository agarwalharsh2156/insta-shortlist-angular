import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'instaShortlist';
  showSidebar = true;
  sidebarCollapsed = false;
  isMobile = false;
  private destroy$ = new Subject<void>();

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
    // Initialize authentication check on app startup
    this.initializeAuthentication();

    // Setup router event monitoring
    this.setupRouterEvents();

    // Check for mobile screen size
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeAuthentication() {
    // Check authentication state on app initialization
    if (!this.authService.isLoggedIn()) {
      this.authService.clearAuthState();
      // Only redirect if not already on auth routes
      if (!this.isAuthRoute(this.router.url)) {
        this.router.navigate(['/login']);
      }
    }
  }

  private setupRouterEvents() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        const isAuthRoute = this.isAuthRoute(event.url);
        this.showSidebar = !isAuthRoute && !this.isPublicRoute();

        // Auto-close mobile sidebar when navigating to new route
        if (this.isMobile && !this.sidebarCollapsed) {
          this.sidebarCollapsed = true;
        }

        // Verify authentication on each protected route
        if (!isAuthRoute && !this.isPublicRoute() && !this.authService.isLoggedIn()) {
          this.authService.clearAuthState();
          this.router.navigate(['/login']);
        }
      });
  }

  private isAuthRoute(url: string): boolean {
    return url === '/login' || url === '/register';
  }

  // Method to detect public routes that need completely different layout
  isPublicRoute(): boolean {
    return this.router.url.startsWith('/apply/');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  checkMobile() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 992;

    // Handle transition from mobile to desktop
    if (wasMobile && !this.isMobile) {
      // Going from mobile to desktop - expand sidebar if it was collapsed due to mobile
      this.sidebarCollapsed = false;
    }

    // Handle transition from desktop to mobile
    if (!wasMobile && this.isMobile) {
      // Going from desktop to mobile - collapse sidebar
      this.sidebarCollapsed = true;
    }
  }

  // Method to determine if sidebar should be visible (not hidden off-screen)
  isSidebarVisible(): boolean {
    if (!this.showSidebar) return false;
    if (!this.isMobile) return true;

    // On mobile, sidebar is visible only when not collapsed
    return !this.sidebarCollapsed;
  }
}
