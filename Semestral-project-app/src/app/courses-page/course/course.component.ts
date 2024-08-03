import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent {
  @Input() imageSrc?: string;
  @Input() title?: string;
  @Input() cssClass?: string;
  @Output() imageClick = new EventEmitter<void>();

  onImageClick(): void {
    this.imageClick.emit();
    console.log('helooo');
  }
}
