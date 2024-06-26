import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { CoursesPageComponent } from './courses-page/courses-page.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { FAQComponent } from './faq/faq.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'courses', component: CoursesPageComponent },
  { path: 'discussion', component: DiscussionComponent },
  { path: 'FAQ', component: FAQComponent },
];
