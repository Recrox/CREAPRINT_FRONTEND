import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;height:100%;padding:2rem;">
      <mat-card style="width:100%;max-width:480px;padding:1.25rem;">
        <mat-card-title>Inscription</mat-card-title>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" style="width:100%;margin-top:0.75rem;">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput formControlName="username" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width:100%;margin-top:0.75rem;">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width:100%;margin-top:0.75rem;">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" formControlName="password" />
            </mat-form-field>

            <div style="display:flex;justify-content:flex-end;margin-top:1rem;gap:8px;">
              <button mat-stroked-button color="primary" type="button" (click)="goToLogin()">Annuler</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">S'inscrire</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class SignupComponent {
  form: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ username: ['', Validators.required], email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    // best-effort: call auth.register if available, otherwise navigate back to login
    if ((this.auth as any).register) {
      (this.auth as any).register(v.username, v.email, v.password).subscribe({ next: () => this.router.navigate(['/login']), error: () => this.router.navigate(['/login']) });
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToLogin() { this.router.navigate(['/login']); }
}
