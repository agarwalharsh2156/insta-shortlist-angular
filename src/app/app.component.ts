import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'instaShortlist';
  showSidebar = true;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const isAuthRoute = event.url === '/login' || event.url === '/register';
        this.showSidebar = !isAuthRoute;
      });
  }

  // NEW: Method to detect public routes that need completely different layout
  isPublicRoute(): boolean {
    return this.router.url.startsWith('/apply/');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
