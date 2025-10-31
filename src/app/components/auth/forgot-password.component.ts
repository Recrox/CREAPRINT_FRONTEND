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
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;height:100%;padding:2rem;">
      <mat-card style="width:100%;max-width:480px;padding:1.25rem;">
        <mat-card-title>Mot de passe oublié</mat-card-title>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" style="width:100%;margin-top:0.75rem;">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" />
            </mat-form-field>

            <div style="display:flex;justify-content:flex-end;margin-top:1rem;gap:8px;">
              <button mat-stroked-button color="primary" type="button" (click)="goToLogin()">Annuler</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Envoyer</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ForgotPasswordComponent {
  form: any;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    // Call a reset endpoint if available, otherwise show success and go back to login
    if ((this.auth as any).requestPasswordReset) {
      (this.auth as any).requestPasswordReset(v.email).subscribe({ next: () => this.router.navigate(['/login']), error: () => this.router.navigate(['/login']) });
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToLogin() { this.router.navigate(['/login']); }
}
