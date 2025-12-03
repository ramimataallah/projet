import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { authGuard } from './guards/auth.guard';
import { AboutComponent } from './components/about/about.component';
import { BlogComponent } from './components/blog/blog.component';
import { CareersComponent } from './components/careers/careers.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'news', component: NewsListComponent, canActivate: [authGuard] },
	{ path: 'news/:id', component: NewsDetailComponent, canActivate: [authGuard] },
	{ path: 'about', component: AboutComponent },
	{ path: 'blog', component: BlogComponent },
	{ path: 'careers', component: CareersComponent },
	{ path: 'categories', component: CategoriesComponent },
	{ path: 'privacy', component: PrivacyComponent },
	{ path: 'terms', component: TermsComponent },
	{ path: 'contact', component: ContactComponent },
	{ path: 'profile', component: ProfileComponent },
	{ path: '**', redirectTo: '' }
];
