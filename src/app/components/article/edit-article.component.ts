import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import * as apiClient from '../../api-client';

@Component({
  standalone: true,
  selector: 'app-edit-article',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="edit-root">
      <mat-card *ngIf="loading()">
        <div class="loading">Chargement...</div>
      </mat-card>

      <mat-card *ngIf="!loading()">
        <form [formGroup]="form" (ngSubmit)="save()">
          <h2>{{ isNew ? 'Créer un article' : "Éditer l'article" }}</h2>

          <mat-form-field appearance="fill" style="width:100%;">
            <mat-label>Titre</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>

          <mat-form-field appearance="fill" style="width:100%;">
            <mat-label>Contenu</mat-label>
            <textarea matInput rows="6" formControlName="content"></textarea>
          </mat-form-field>

          <mat-form-field appearance="fill" style="width:200px;">
            <mat-label>Prix</mat-label>
            <input matInput type="number" formControlName="price" />
          </mat-form-field>

          <div style="margin-top:1rem; display:flex; gap:0.5rem;">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
              <mat-icon>save</mat-icon>
              Enregistrer
            </button>
            <button mat-stroked-button type="button" (click)="cancel()">Annuler</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .edit-root { display:flex; justify-content:center; padding:1rem; }
    mat-card { width:100%; max-width:900px; padding:1rem; }
  `]
})
export class EditArticleComponent {
  loading = signal(true);
  saving = signal(false);

  form: FormGroup;

  private currentArticle?: apiClient.apiClient.Article;
  isNew = false;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private articleService: ArticleService, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      price: [0, Validators.required]
    });
    this.route.paramMap.subscribe(pm => {
      const idStr = pm.get('id');
      const id = idStr ? Number(idStr) : NaN;
      if (!isNaN(id)) {
        this.isNew = false;
        this.loading.set(true);
        this.articleService.getArticle(id).subscribe({
          next: a => {
            this.currentArticle = a;
            this.form.patchValue({ title: a.title, content: a.content, price: a.price });
            this.loading.set(false);
          },
          error: () => { this.loading.set(false); }
        });
      } else {
        // create mode
        this.isNew = true;
        this.currentArticle = undefined;
        this.loading.set(false);
      }
    });
  }

  save() {
    const fv = this.form.value;
    if (!this.isNew && this.currentArticle && this.currentArticle.id) {
      // update
      this.saving.set(true);
      const updated: apiClient.apiClient.Article = new apiClient.apiClient.Article({
        ...this.currentArticle,
        title: fv.title ?? '',
        content: fv.content ?? '',
        price: Number(fv.price ?? 0)
      });
  this.articleService.updateArticle(this.currentArticle.id, updated).subscribe({
        next: () => {
          this.saving.set(false);
          this.snackBar.open('Article mis à jour', 'OK', { duration: 2000 });
          this.router.navigate(['/', this.route.snapshot.paramMap.get('lang') || 'fr', 'articles', this.currentArticle!.id]);
        },
        error: () => { this.saving.set(false); this.snackBar.open('Erreur lors de la mise à jour', 'OK', { duration: 3000 }); }
      });
    } else {
      // create
      this.saving.set(true);
      const createdArticle = new apiClient.apiClient.Article({
        title: fv.title ?? '',
        content: fv.content ?? '',
        price: Number(fv.price ?? 0)
      });
      this.articleService.createArticle(createdArticle).subscribe({
        next: a => {
          this.saving.set(false);
          this.snackBar.open('Article créé', 'OK', { duration: 2000 });
            if (a && (a as any).id) {
            this.router.navigate(['/', this.route.snapshot.paramMap.get('lang') || 'fr', 'articles', (a as any).id]);
          } else {
            this.router.navigate(['/', this.route.snapshot.paramMap.get('lang') || 'fr', 'articles']);
          }
        },
        error: () => { this.saving.set(false); this.snackBar.open('Erreur lors de la création', 'OK', { duration: 3000 }); }
      });
    }
  }

  cancel() { const id = this.currentArticle?.id; const lang = this.route.snapshot.paramMap.get('lang') || 'fr'; if (id) this.router.navigate(['/', lang, 'articles', id]); else this.router.navigate(['/', lang, 'articles']); }
}

