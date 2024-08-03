import { Component } from '@angular/core';
import { Course } from './course/course.model';
import { CourseComponent } from './course/course.component';
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
      imageSrc: '../../assets/ML.webp',
      title: 'Machine-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/DL.webp',
      title: 'Deep-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/algo.webp',
      title: 'Algorithms',
      cssClass: 'CourseClass',
    },
  ];

  courses2: Course[] = [
    {
      imageSrc: '../../assets/CM.webp',
      title: 'Computational-Models',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/AI.webp',
      title: 'Artificial-Inteligence',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/DS.webp',
      title: 'Data-Structures',
      cssClass: 'CourseClass',
    },
  ];

  courses3: Course[] = [
    {
      imageSrc: '../../assets/OS.webp',
      title: 'Operating-Systems',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/SWE.webp',
      title: 'Software-Engineering',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/DM.webp',
      title: 'Discrete-Mathematics',
      cssClass: 'CourseClass',
    },
  ];

  courses4: Course[] = [
    {
      imageSrc: '../../assets/calc.webp',
      title: 'Calculus',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/algebra.webp',
      title: 'Algebra',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/prob.webp',
      title: 'Probability-Theory',
      cssClass: 'CourseClass',
    },
  ];
}
