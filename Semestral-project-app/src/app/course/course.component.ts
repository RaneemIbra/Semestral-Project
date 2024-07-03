import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
})
export class CourseComponent {
  @Input() imageSrc?: string;
  @Input() title?: string;
  @Input() cssClass?: string;
}
