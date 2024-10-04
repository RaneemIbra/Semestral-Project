import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../course/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseComponent } from '../course/course.component';
import { CommonModule } from '@angular/common';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, Unsubscribe } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-preview',
  standalone: true,
  imports: [CourseComponent, CommonModule],
  templateUrl: './course-preview.component.html',
  styleUrl: './course-preview.component.css',
})
export class CoursePreviewComponent implements OnInit, OnDestroy {
  course?: Course | null = null;
  userCanEdit: boolean = false;
  private authStateSub!: Unsubscribe;
  private courseDataSub!: Subscription;

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

    this.authStateSub = onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.checkUserPermissions(user.uid);
      } else {
        this.userCanEdit = false;
        this.router.navigate(['/login']);
      }
    });
  }

  async checkUserPermissions(userId: string) {
    try {
      const userDocRef = doc(this.firestore, `users/${userId}`);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        this.userCanEdit = userData['modify'] || false;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  loadCourse(title: string): void {
    const courseDocRef = doc(this.firestore, `courses/${title}`);
    getDoc(courseDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          this.course = docSnap.data() as Course;
        } else {
          console.error('Course not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching course:', error);
      });
  }

  ngOnDestroy(): void {
    if (this.authStateSub) {
      this.authStateSub();
    }
    if (this.courseDataSub) {
      this.courseDataSub.unsubscribe();
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
