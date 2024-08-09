import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { CoursesPageComponent } from './courses-page/courses-page.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { FAQComponent } from './faq/faq.component';
import { CoursePreviewComponent } from './courses-page/course-preview/course-preview.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DiscussionPreviewComponent } from './discussion/discussion-preview/discussion-preview.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'courses', component: CoursesPageComponent },
  { path: 'discussion', component: DiscussionComponent },
  { path: 'FAQ', component: FAQComponent },
  { path: 'preview/:title', component: CoursePreviewComponent },
  { path: 'contactUs', component: ContactUsComponent },
  { path: 'discussionPreview/:title', component: DiscussionPreviewComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
];
