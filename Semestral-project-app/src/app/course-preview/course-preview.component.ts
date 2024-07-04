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
  course?: Course;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const title = params.get('title');
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
    } else {
      console.error('Course not found');
    }
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
