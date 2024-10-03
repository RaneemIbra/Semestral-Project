import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  Firestore,
  doc,
  updateDoc,
  increment,
  arrayUnion,
} from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { getFirestore, runTransaction } from 'firebase/firestore';

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
  @Input() maxStudents?: number;
  @Input() currentStudents?: number;
  @Input() teacherName?: string;
  @Input() courseId?: string;
  @Output() imageClick = new EventEmitter<void>();

  isEnrolled: boolean = false;

  constructor(private firestore: Firestore, private auth: AuthService) {}

  ngOnInit() {
    const userId = this.auth.getCurrentUserId();
    if (userId) {
      this.auth.getUserData(userId).subscribe((docSnap: any) => {
        const enrolledCourses = docSnap?.enrolledCourses || [];
        this.isEnrolled = enrolledCourses.includes(this.courseId);
      });
    } else {
      console.error('No user ID found');
    }
  }

  enroll(event: Event) {
    event.stopPropagation();

    if (!this.courseId) {
      console.error('Course ID is not defined.');
      return;
    }

    if (this.currentStudents! < this.maxStudents!) {
      const userId = this.auth.getCurrentUserId();

      if (!userId) {
        console.error('No user ID found');
        return;
      }

      const userDocRef = doc(this.firestore, `users/${userId}`);
      const courseDocRef = doc(this.firestore, `courses/${this.courseId}`);

      const firestore = getFirestore();
      runTransaction(firestore, async (transaction) => {
        const courseDoc = await transaction.get(courseDocRef);
        if (!courseDoc.exists()) {
          throw 'Course does not exist!';
        }

        transaction.update(courseDocRef, { currentStudents: increment(1) });

        transaction.update(userDocRef, {
          enrolledCourses: arrayUnion(this.courseId),
        });
      })
        .then(() => {
          this.isEnrolled = true;
          console.log('Successfully enrolled');
        })
        .catch((error: any) => {
          console.error('Error enrolling:', error);
        });
    } else {
      console.log('Course is full');
    }
  }

  navigateToPreview() {
    if (this.isEnrolled) {
      this.imageClick.emit();
    } else {
      console.log('You must enroll to access the preview');
    }
  }
}
