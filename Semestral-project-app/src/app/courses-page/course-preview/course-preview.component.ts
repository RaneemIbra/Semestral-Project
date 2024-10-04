import { Component, OnInit } from '@angular/core';
import { Course } from '../course/course.model';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, docData, getDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-preview.component.html',
  styleUrls: ['./course-preview.component.css'],
})
export class CoursePreviewComponent implements OnInit {
  course?: Course | null = null;
  userCanEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const title = params.get('title');
      if (title) {
        this.loadCourse(title);
      }
    });

    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.checkUserPermissions(user.uid);
      }
    });
  }

  loadCourse(title: string): void {
    const courseDocRef = doc(this.firestore, `courses/${title}`);
    docData(courseDocRef).subscribe(
      (courseData: Course | undefined) => {
        if (courseData) {
          this.course = courseData;
          console.log('Course loaded:', this.course);
        } else {
          console.error('No such course found in the database');
        }
      },
      (error: any) => {
        console.error('Error fetching course:', error);
      }
    );
  }

  async checkUserPermissions(userId: string) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      this.userCanEdit = userData['modify'] || false;
    } else {
      console.error('No such user document!');
    }
  }

  editFirstDiv() {
    console.log('Editing first div');
  }

  editSecondDiv() {
    console.log('Editing second div');
  }

  navigateToDiscussion(title: string | undefined): void {
    if (title) {
      this.router.navigate(['/discussionPreview', title]);
    }
  }
}
