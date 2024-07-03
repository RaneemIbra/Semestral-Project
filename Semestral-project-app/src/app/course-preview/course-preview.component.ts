import { Component, OnInit } from '@angular/core';
import { Course } from '../course/course.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-preview',
  standalone: true,
  imports: [],
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
    const allCourses = [...this.courses];
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
      cssClass: 'MLStyle',
    },
  ];
}
