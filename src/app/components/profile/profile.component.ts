import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import * as apiClient from '../../api-client';
import { sharedAxiosInstance, TokenService } from '../../services/http.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatListModule, MatIconModule],
  template: `
    <div style="display:flex;justify-content:center;padding:2rem;">
      <mat-card style="width:100%;max-width:820px;padding:1rem;">
        <mat-card-title>Profil utilisateur</mat-card-title>
        <mat-card-content>
          <div *ngIf="auth.isLoggedInSignal()() ; else notLogged">
            <div *ngIf="loading()" style="display:flex;justify-content:center;padding:1rem;">
              <mat-progress-spinner diameter="40" mode="indeterminate"></mat-progress-spinner>
            </div>

            <div *ngIf="!loading()">
              <ng-container *ngIf="user(); else noUser">
                  <p>Informations utilisateur :</p>
                  <mat-list>
                    <mat-list-item>
                      <mat-icon matListIcon>person</mat-icon>
                      <h4 matLine>Nom d'utilisateur</h4>
                      <p matLine>{{ user()?.username || '—' }}</p>
                    </mat-list-item>
                    <mat-list-item>
                      <mat-icon matListIcon>key</mat-icon>
                      <h4 matLine>Mot de passe (hash)</h4>
                      <p matLine style="word-break:break-word">{{ user()?.passwordHash || '—' }}</p>
                    </mat-list-item>
                    <mat-list-item>
                      <mat-icon matListIcon>security</mat-icon>
                      <h4 matLine>Rights</h4>
                      <p matLine>{{ rightsLabel() }}</p>
                    </mat-list-item>
                    <mat-list-item>
                      <mat-icon matListIcon>update</mat-icon>
                      <h4 matLine>Dernière modification</h4>
                      <p matLine>{{ user()?.updatedOn ? (user()?.updatedOn | date:'medium') : '—' }}</p>
                    </mat-list-item>
                  </mat-list>
                <div style="margin-top:1rem;display:flex;gap:0.5rem;">
                  <button mat-flat-button color="primary" (click)="go('/basket')">Voir le panier</button>
                  <button mat-stroked-button color="warn" (click)="logout()">Se déconnecter</button>
                </div>
              </ng-container>
              <ng-template #noUser>
                <p>Impossible de récupérer les informations utilisateur.</p>
              </ng-template>
            </div>
          </div>
          <ng-template #notLogged>
            <p>Vous n'êtes pas connecté.</p>
            <button mat-flat-button color="primary" (click)="go('/login')">Aller à la page de connexion</button>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private userSignal = signal<apiClient.apiClient.User | undefined>(undefined);
  user = this.userSignal;
  loading = signal(false);

  constructor(public auth: AuthStateService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  async fetchUser() {
    if (!this.auth.isLoggedInSignal()()) return;
    this.loading.set(true);
    const client = new apiClient.apiClient.ApiClient(environment.apiBaseUrl, sharedAxiosInstance as any);

    // Try endpoint /api/User/me first (common pattern)
    try {
      const resp = await sharedAxiosInstance.get(environment.apiBaseUrl + '/api/User/me');
      if (resp && resp.data) {
        try { this.userSignal.set(apiClient.apiClient.User.fromJS(resp.data)); this.loading.set(false); return; } catch {}
      }
    } catch (e) {
      // ignore and fall back
    }

    // Fallback: try userAll and try to infer current user from token payload
    try {
      const all = await client.userAll();
      if (Array.isArray(all) && all.length > 0) {
        // try decode token to find username
        const token = TokenService.getToken();
        let usernameFromToken: string | undefined;
        if (token) {
            try {
            const parts = token.split('.');
            if (parts.length >= 2) {
              // browser-safe base64 decode
              const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
              const json = decodeURIComponent(Array.prototype.map.call(atob(padded), function(c: string) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              const payload = JSON.parse(json);
              usernameFromToken = payload['unique_name'] || payload['name'] || payload['sub'] || payload['email'] || payload['username'];
            }
          } catch (e) {
            // ignore
          }
        }

        let found: any = undefined;
        if (usernameFromToken) {
          found = all.find((u: any) => (u.username && u.username.toLowerCase() === (usernameFromToken || '').toLowerCase()));
        }
        if (!found) {
          // if not found, and there's only one user, assume it
          if (all.length === 1) found = all[0];
        }
        if (found) {
          try { this.userSignal.set(apiClient.apiClient.User.fromJS(found)); this.loading.set(false); return; } catch {}
        }
      }
    } catch (e) {
      // ignore
    }

    this.loading.set(false);
  }

  userEntries() {
    const u = this.userSignal();
    if (!u) return [] as Array<{key:string,value:any}>;
    const obj = (u as any).toJSON ? (u as any).toJSON() : u;
    return Object.keys(obj).map(k => ({ key: k, value: obj[k] }));
  }

  rightsLabel(): string {
    const u = this.userSignal();
    if (!u || u.rights === undefined || u.rights === null) return '—';
    // try to map enum numeric value to its name
    try {
      const label = (apiClient.apiClient.UserRights as any)[u.rights];
      return label ?? String(u.rights);
    } catch {
      return String(u.rights);
    }
  }

  go(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.setLoggedIn(false);
    TokenService.setToken(null);
    this.router.navigate(['/']);
  }
}
