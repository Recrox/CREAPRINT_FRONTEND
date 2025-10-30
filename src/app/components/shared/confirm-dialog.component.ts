import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div style="padding:1rem 1.25rem; max-width:420px;">
      <h3 style="margin:0 0 0.5rem 0;">Confirmer la suppression</h3>
      <p style="margin:0 0 1rem 0;">Êtes-vous sûr·e de vouloir supprimer cet article ? Cette action est irréversible.</p>
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;">
        <button mat-stroked-button (click)="onCancel()">Annuler</button>
        <button mat-flat-button color="warn" (click)="onConfirm()">Supprimer</button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
