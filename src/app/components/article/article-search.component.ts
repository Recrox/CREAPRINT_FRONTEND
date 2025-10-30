import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
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
  private timer: any = undefined;

  constructor() {}

  onChange(v: string) {
    // simple debounce with setTimeout to avoid rxjs operator import issues in different runtime setups
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.search.emit(v ?? '');
      this.timer = undefined;
    }, 300);
  }

  clear() {
    this.q = '';
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.search.emit('');
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
