import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { HomeComponent } from './components/home.component';
import { HeaderComponent } from './layout/header.component';
import { SidebarComponent } from './layout/sidebar.component';
import { FooterComponent } from './layout/footer.component';
import { AuthService } from './services/auth.service';
import { AuthStateService } from './services/auth-state.service';
import { environment } from '../environments/environment';
import { TranslocoService } from '@ngneat/transloco';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent, ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('CreaPrint');
  protected readonly production = environment.production;
  // expose component type for dynamic outlet
  // show dev cookie manager when not in production, or when URL has ?devCookies=1
  protected readonly showDevCookie = !environment.production || new URL(window.location.href).searchParams.has('devCookies');

  constructor(private router: Router, private auth: AuthService, private authState: AuthStateService, private transloco: TranslocoService) {}

  ngOnInit(): void {
    // restore auth state from token or server session, then enable debug auto-login
    this.auth.checkAuth().then(() => {
      // set persisted language or fall back to browser language
      const saved = (() => { try { return localStorage.getItem('lang'); } catch (e) { return null; } })();
      if (saved) {
        this.transloco.setActiveLang(saved);
      } else {
        const nav = navigator.language?.split('-')[0] || 'fr';
        const pick = ['fr','en','de','nl'].includes(nav) ? nav : 'fr';
        this.transloco.setActiveLang(pick);
      }
      this.connectAdminInDebug();
    });
  }

  // Auto-login when navigating to base '/' for debug convenience (only in non-production)
  private connectAdminInDebug() {
    if (!environment.production) {
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          const url = e.urlAfterRedirects || e.url;
          if (url === '/' || url === '') {
            // Only attempt if not already logged in
            if (!this.authState.isLoggedIn()) {
              this.auth.login('admin', 'admin123').subscribe({ next: () => { }, error: () => { } });
            }
          }
        }
      });
    }
  }
}
