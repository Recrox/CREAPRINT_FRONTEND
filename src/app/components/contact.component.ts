import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card style="max-width:500px;margin:auto;margin-top:3rem;padding:2rem;">
      <mat-card-title>Contactez-nous</mat-card-title>
      <form #contactForm="ngForm" (ngSubmit)="submit()">
        <mat-form-field appearance="outline" style="width:100%;margin-bottom:1rem;">
          <mat-label>Nom</mat-label>
          <input matInput name="name" [(ngModel)]="name" required>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;margin-bottom:1rem;">
          <mat-label>Email</mat-label>
          <input matInput name="email" [(ngModel)]="email" required type="email">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;margin-bottom:1rem;">
          <mat-label>Message</mat-label>
          <textarea matInput name="message" [(ngModel)]="message" required rows="5"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="!contactForm.form.valid">Envoyer</button>
      </form>
      <div *ngIf="sent" style="margin-top:1rem;color:green;">Message envoyé !</div>
    </mat-card>
  `
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';
  sent = false;

  submit() {
    // Ici, tu pourrais envoyer le message à une API ou afficher une notification
    this.sent = true;
    setTimeout(() => this.sent = false, 3000);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
