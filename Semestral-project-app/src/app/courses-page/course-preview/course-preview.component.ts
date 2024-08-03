import { Component, OnInit } from '@angular/core';
import { Course } from '../course/course.model';
import { ActivatedRoute } from '@angular/router';
import { CourseComponent } from '../course/course.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-preview',
  standalone: true,
  imports: [CourseComponent, CommonModule],
  templateUrl: './course-preview.component.html',
  styleUrl: './course-preview.component.css',
})
export class CoursePreviewComponent implements OnInit {
  course?: Course | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const title = params.get('title');
      console.log('Title from params:', title);
      if (title) {
        this.loadCourse(title);
      }
    });
  }

  loadCourse(title: string): void {
    const allCourses = [...this.courses, ...this.courses2, ...this.courses3];
    const foundCourse = allCourses.find((course) => course.title === title);
    if (foundCourse) {
      this.course = foundCourse;
      console.log('Found course:', this.course);
    } else {
      console.error('Course not found');
    }
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
      title: 'Machine-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/AI.webp',
      title: 'Deep-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/DS.webp',
      title: 'Algorithms',
      cssClass: 'CourseClass',
    },
  ];

  courses3: Course[] = [
    {
      imageSrc: '../../assets/OS.webp',
      title: 'Machine-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/SWE.webp',
      title: 'Deep-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/DM.webp',
      title: 'Algorithms',
      cssClass: 'CourseClass',
    },
  ];

  courses4: Course[] = [
    {
      imageSrc: '../../assets/calc.webp',
      title: 'Machine-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/algebra.webp',
      title: 'Deep-Learning',
      cssClass: 'CourseClass',
    },
    {
      imageSrc: '../../assets/prob.webp',
      title: 'Algorithms',
      cssClass: 'CourseClass',
    },
  ];
}
