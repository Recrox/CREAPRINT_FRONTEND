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
    <div class="profile-page">
      <div class="hero">
        <div class="avatar">
          <mat-icon>person</mat-icon>
        </div>
        <div class="hero-meta">
          <h2 class="hero-name">{{ user()?.username || 'Utilisateur' }}</h2>
          <p class="hero-sub">ID: {{ user()?.id ?? '—' }} • Rights: {{ rightsLabel() }}</p>
        </div>
        <div class="hero-actions">
          <button mat-stroked-button color="primary" (click)="go('/basket')">Panier</button>
          <button mat-flat-button color="warn" (click)="logout()">Déconnexion</button>
        </div>
      </div>

      <mat-card class="details-card">
        <mat-card-content>
          <div *ngIf="auth.isLoggedInSignal()() ; else notLogged">
            <div *ngIf="loading()" class="spinner-wrap">
              <mat-progress-spinner diameter="32" mode="indeterminate"></mat-progress-spinner>
            </div>

            <div *ngIf="!loading()">
              <div *ngIf="user(); else noUser" class="details-grid">
                <div class="left">
                  <h3>Compte</h3>
                  <p class="muted">Informations personnelles et métadonnées du compte</p>
                </div>
                <div class="right">
                  <div class="field"><span class="label">Nom d'utilisateur</span><span class="value">{{ user()?.username || '—' }}</span></div>
                  <div class="field"><span class="label">Mot de passe (hash)</span><span class="value long-text">{{ user()?.passwordHash || '—' }}</span></div>
                  <div class="field"><span class="label">Créé le</span><span class="value">{{ user()?.createdOn ? (user()?.createdOn | date:'medium') : '—' }}</span></div>
                  <div class="field"><span class="label">Dernière modification</span><span class="value">{{ user()?.updatedOn ? (user()?.updatedOn | date:'medium') : '—' }}</span></div>
                </div>
              </div>
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
  `,
  styles: [
    `
    :host { display:block; }
    .profile-page { max-width:980px; margin:16px auto; padding:16px; box-sizing:border-box; }
    .hero { display:flex; align-items:center; gap:16px; background:linear-gradient(90deg, #f5f7fb, #ffffff); padding:16px; border-radius:8px; }
    .avatar { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#3f51b5,#2196f3); display:flex; align-items:center; justify-content:center; color:#fff; font-size:28px; }
    .hero-name { margin:0; font-size:20px; }
    .hero-sub { margin:0; color:rgba(0,0,0,0.6); font-size:13px; }
    .hero-actions { margin-left:auto; display:flex; gap:8px; }

    .details-card { margin-top:16px; max-height: calc(100vh - 220px); overflow:hidden; }
    .details-card mat-card-content { overflow:auto; padding-right:12px; }
    .details-grid { display:grid; grid-template-columns: 240px 1fr; gap:16px; align-items:start; }
    .details-grid .left { padding:8px; border-right:1px solid rgba(0,0,0,0.04); }
    .muted { color:rgba(0,0,0,0.6); margin-top:8px; }
    .field { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px dashed rgba(0,0,0,0.04); }
    .label { color:rgba(0,0,0,0.6); font-size:13px; }
    .value { font-weight:600; max-width:100%; word-break:break-word; }
    .long-text { white-space:normal; word-break:break-all; }

    @media (max-width: 720px) {
      .details-grid { grid-template-columns: 1fr; }
      .details-grid .left { border-right:none; border-bottom:1px solid rgba(0,0,0,0.04); }
      .hero { flex-direction:column; align-items:flex-start; }
      .hero-actions { margin-left:0; width:100%; justify-content:flex-end; }
    }
    `
  ]
})
export class ProfileComponent implements OnInit {
  private userSignal = signal<apiClient.apiClient.User | undefined>(undefined);
  user = this.userSignal;
  loading = signal(false);

  constructor(public auth: AuthStateService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.user());
    
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
        // normalize common wrappers
        let data: any = resp.data;
        if (data.user) data = data.user;
        else if (data.data) data = data.data;
        else if (data.result) data = data.result;
        try {
          this.userSignal.set(apiClient.apiClient.User.fromJS(data));
          this.loading.set(false);
          return;
        } catch (err) {
          console.debug('Profile: unable to parse user from /api/User/me', data, err);
        }
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
