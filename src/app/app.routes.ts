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
        path: 'articles/new',
        loadComponent: () => import('./components/article/edit-article.component').then(m => m.EditArticleComponent)
    },
	{
		path: 'articles/:id',
		loadComponent: () => import('./components/article/article-detail.component').then(m => m.ArticleDetailComponent)
	},
	{
		path: 'articles/:id/edit',
		loadComponent: () => import('./components/article/edit-article.component').then(m => m.EditArticleComponent)
	},
	{
		path: 'contact',
		loadComponent: () => import('./components/contact.component').then(m => m.ContactComponent)
	}
	,
	{
		path: 'login',
		loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
	}
	,
	{
		path: 'profile',
		loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
	}
	,
	{
		path: 'basket',
		loadComponent: () => import('./components/basket/basket.component').then(m => m.BasketComponent)
	}
	,
	{
		path: '**',
		loadComponent: () => import('./components/not-found.component').then(m => m.NotFoundComponent)
	}
];
