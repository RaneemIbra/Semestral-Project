import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from './course/course.model';
import { CourseComponent } from './course/course.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CourseComponent, CommonModule],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css',
})
export class CoursesPageComponent implements OnInit, OnDestroy {
  courses$!: Observable<Course[]>;
  private authSubscription!: Subscription;

  constructor(
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authState$.subscribe((user) => {
      if (user) {
        this.loadCourses();
      } else {
        this.courses$ = new Observable();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadCourses(): void {
    const coursesCollection = collection(this.firestore, 'courses');
    this.courses$ = collectionData(coursesCollection, {
      idField: 'courseId',
    }) as Observable<Course[]>;
  }

  navigateToPreview(course: Course): void {
    this.router.navigate(['/preview', course.title]);
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
  }
}
