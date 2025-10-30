import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./components/home.component').then(m => m.HomeComponent)
	},
	{
		path: 'about',
		loadComponent: () => import('./components/about.component').then(m => m.AboutComponent)
	},
	{
		path: 'articles',
		loadComponent: () => import('./components/article/article-list.component').then(m => m.ArticleListComponent)
	},
	{
		path: 'articles/:id',
		loadComponent: () => import('./components/article/article-detail.component').then(m => m.ArticleDetailComponent)
	},
	{
		path: 'contact',
		loadComponent: () => import('./components/contact.component').then(m => m.ContactComponent)
	}
];
