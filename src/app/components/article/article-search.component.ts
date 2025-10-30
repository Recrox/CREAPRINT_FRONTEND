import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-article-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" style="width:100%;">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput placeholder="Rechercher des articles (titre ou contenu)" [(ngModel)]="q" (ngModelChange)="onChange($event)" />
      <button *ngIf="q" matSuffix mat-icon-button aria-label="Clear" (click)="clear()">
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>
  `
})
export class ArticleSearchComponent implements OnDestroy {
  @Output() search = new EventEmitter<string>();
  q = '';
  private changes = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.changes.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(v => this.search.emit(v));
  }

  onChange(v: string) {
    this.changes.next(v ?? '');
  }

  clear() {
    this.q = '';
    this.changes.next('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.changes.complete();
  }
}
