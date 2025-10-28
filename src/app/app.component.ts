import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ArticleListComponent } from './article-list/article-list.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, MatToolbarModule, ArticleListComponent],
  template: `
    <mat-toolbar color="primary">CREAPRINT - Articles</mat-toolbar>
    <div class="app-body">
      <app-article-list></app-article-list>
    </div>
  `,
  styles: [`.app-body { padding: 16px }`]
})
export class AppComponent {}
