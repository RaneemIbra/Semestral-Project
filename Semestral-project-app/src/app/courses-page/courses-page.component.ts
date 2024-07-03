import { Component } from '@angular/core';
import { Course } from '../course/course.model';
import { CourseComponent } from '../course/course.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CourseComponent, CommonModule],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css',
})
export class CoursesPageComponent {
  courses: Course[] = [
    {
      imageSrc: '../../assets/ML.jpg',
      title: 'Machine-Learning',
      cssClass: 'MLStyle',
    },
  ];
}
