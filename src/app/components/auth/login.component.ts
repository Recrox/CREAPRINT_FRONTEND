import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterModule],
  template: `
  <div style="display:flex;justify-content:center;align-items:center;height:100%;padding:2rem;">
    <mat-card style="width:100%;max-width:420px;padding:1.5rem;">
      <mat-card-title style="text-align:center">Connexion</mat-card-title>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill" style="width:100%;margin-top:1rem;">
            <mat-label>Nom d'utilisateur</mat-label>
            <input matInput formControlName="username" autocomplete="username" />
          </mat-form-field>

          <mat-form-field appearance="fill" style="width:100%;margin-top:1rem;">
            <mat-label>Mot de passe</mat-label>
            <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="current-password" />
            <button mat-icon-button matSuffix type="button" (click)="toggleShowPassword()" [attr.aria-label]="showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
              <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:1.25rem;">
            <button mat-flat-button color="primary" type="submit" [disabled]="loading() || form.invalid">
              Se connecter
            </button>
            <div *ngIf="loading()" style="display:flex;align-items:center;gap:.5rem;">
              <mat-progress-spinner mode="indeterminate" diameter="24" color="primary"></mat-progress-spinner>
            </div>
          </div>

          <div *ngIf="errorMessage()" style="color:#b00020;margin-top:1rem;">{{ errorMessage() }}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;gap:8px;">
            <a routerLink="/forgot-password" style="font-size:0.9rem;color:var(--primary);text-decoration:underline;">Mot de passe oublié ?</a>
            <a routerLink="/signup" style="font-size:0.9rem;color:var(--primary);text-decoration:underline;">S'inscrire</a>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  </div>
  `
})
export class LoginComponent {
  form!: FormGroup;

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.errorMessage.set('');
    this.loading.set(true);
    const v = this.form.value;
    this.auth.login(v.username, v.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMessage.set(err?.message || 'Échec de la connexion');
      }
    });
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }
}
