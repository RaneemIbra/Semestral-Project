import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { CoursesPageComponent } from './courses-page/courses-page.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { FAQComponent } from './faq/faq.component';
import { CourseComponent } from './course/course.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    LoginComponent,
    HomePageComponent,
    HeaderComponent,
    CoursesPageComponent,
    DiscussionComponent,
    FAQComponent,
    CourseComponent,
    ContactUsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Semestral-project-app';
  showHeader: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.showHeader = event.urlAfterRedirects !== '/login';
      });
  }

  refreshPage() {
    window.location.reload();
  }
}
