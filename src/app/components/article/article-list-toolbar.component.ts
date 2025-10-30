import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleSearchComponent } from './article-search.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-list-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ArticleSearchComponent, MatSlideToggleModule, MatIconModule],
  template: `
    <div style="margin-bottom:1rem; display: flex; align-items: center; gap: 1rem;">
      <div style="flex:1;">
        <app-article-search (search)="search.emit($event)"></app-article-search>
      </div>
      <mat-slide-toggle color="primary" [checked]="isGridMode()" (change)="isGridMode.set($event.checked)" style="margin-left:0.5rem;">
        <mat-icon>{{ isGridMode() ? 'grid_view' : 'table_chart' }}</mat-icon>
        <span style="margin-left:0.5rem;">{{ isGridMode() ? 'Grille' : 'Tableau' }}</span>
      </mat-slide-toggle>
    </div>
  `
})
export class ArticleListToolbarComponent {
  @Output() search = new EventEmitter<string>();
  @Input() isGridMode!: { (): boolean; set: (v: boolean) => void };
}

