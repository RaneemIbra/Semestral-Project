import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../course/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseComponent } from '../course/course.component';
import { CommonModule } from '@angular/common';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  Unsubscribe,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
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
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
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

  editFirstDiv(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile && this.course) {
      this.uploadFile(this.selectedFile, 'firstDivFiles');
    }
  }

  editSecondDiv(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile && this.course) {
      this.uploadFile(this.selectedFile, 'secondDivFiles');
    }
  }

  async uploadFile(file: File, divField: 'firstDivFiles' | 'secondDivFiles') {
    if (this.course) {
      const storageRef = ref(
        this.storage,
        `courseFiles/${this.course.courseId}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      const courseDocRef = doc(
        this.firestore,
        `courses/${this.course.courseId}`
      );
      const updatedFiles = [...(this.course[divField] || []), downloadUrl];
      await updateDoc(courseDocRef, { [divField]: updatedFiles });
      this.loadCourse(this.course.courseId);
    }
  }

  openFile(url: string) {
    window.open(url, '_blank');
  }

  ngOnDestroy(): void {
    if (this.authStateSub) {
      this.authStateSub();
    }
    if (this.courseDataSub) {
      this.courseDataSub.unsubscribe();
    }
  }

  navigateToDiscussion(title: string | undefined): void {
    if (title) {
      this.router.navigate(['/discussionPreview', title]);
    }
  }
}
