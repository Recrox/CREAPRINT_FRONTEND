import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslocoModule],
  template: `
  <mat-card class="about-card" style="padding:2rem;">
      <mat-card-title>{{ 'about.title' | transloco }}</mat-card-title>
      <mat-card-content>
        <p>{{ 'about.welcome' | transloco }}</p>
        <p [innerHTML]="'about.stack' | transloco"></p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .about-card {
      max-width: 500px;
      margin: 2rem auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class AboutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(public transloco: TranslocoService) {}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
