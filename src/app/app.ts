import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
// import { HomeComponent } from './components/home.component';
import { HeaderComponent } from './layout/header.component';
import { SidebarComponent } from './layout/sidebar.component';
import { FooterComponent } from './layout/footer.component';
import { AuthService } from './services/auth.service';
import { AuthStateService } from './services/auth-state.service';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('CreaPrint');

  constructor(private router: Router, private auth: AuthService, private authState: AuthStateService) {}

  ngOnInit(): void {
    this.connectAdminInDebug();
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
