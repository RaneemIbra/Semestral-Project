import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Firestore,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  runTransaction,
} from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit, OnDestroy {
  @Input() imageSrc?: string;
  @Input() title?: string;
  @Input() cssClass?: string;
  @Input() maxStudents?: number;
  @Input() currentStudents?: number;
  @Input() teacherName?: string;
  @Input() courseId?: string;
  @Output() imageClick = new EventEmitter<void>();

  isEnrolled: boolean = false;
  private userSubscription!: Subscription;
  userId: string | null = null;

  constructor(private firestore: Firestore, private auth: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.auth.authState$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadUserData();
      } else {
        this.userId = null;
        this.resetEnrollmentState();
      }
    });
    this.auth.trackSubscription(this.userSubscription);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadUserData() {
    if (this.userId && this.courseId) {
      const sub = this.auth
        .getUserData(this.userId)
        .subscribe((docSnap: any) => {
          const enrolledCourses = docSnap?.enrolledCourses || [];
          this.isEnrolled = enrolledCourses.includes(this.courseId);
        });
      this.auth.trackSubscription(sub);
    }
  }

  enroll(event: Event) {
    event.stopPropagation();
    if (!this.courseId) {
      console.error('Course ID is not defined.');
      return;
    }

    if (this.currentStudents! < this.maxStudents!) {
      if (!this.userId) {
        console.error('No user ID found');
        return;
      }

      const userDocRef = doc(this.firestore, `users/${this.userId}`);
      const courseDocRef = doc(this.firestore, `courses/${this.courseId}`);

      console.log(`Enrolling user ${this.userId} in course ${this.courseId}`);

      runTransaction(this.firestore, async (transaction) => {
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

  resetEnrollmentState() {
    this.isEnrolled = false;
  }
}
