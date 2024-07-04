import { Component } from '@angular/core';
import { Course } from '../course/course.model';
import { CourseComponent } from '../course/course.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CourseComponent, CommonModule],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css',
})
export class CoursesPageComponent {
  constructor(private router: Router) {}

  navigateToPreview(course: Course): void {
    this.router.navigate(['/preview', course.title]);
  }

  courses: Course[] = [
    {
      imageSrc: '../../assets/ML.jpg',
      title: 'Machine-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/deep.jpg',
      title: 'Deep-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/algorithms.png',
      title: 'Algorithms',
      cssClass: 'CourseClass',
    },
  ];

  courses2: Course[] = [
    {
      imageSrc: '../../assets/ML.jpg',
      title: 'Machine-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/deep.jpg',
      title: 'Deep-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/algorithms.png',
      title: 'Algorithms',
      cssClass: 'CourseClass',
    },
  ];

  courses3: Course[] = [
    {
      imageSrc: '../../assets/ML.jpg',
      title: 'Machine-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/deep.jpg',
      title: 'Deep-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/algorithms.png',
      title: 'Algorithms',
      cssClass: 'CourseClass',
    },
  ];
}
