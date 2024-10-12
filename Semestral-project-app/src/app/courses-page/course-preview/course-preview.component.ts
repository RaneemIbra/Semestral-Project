import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../course/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseComponent } from '../course/course.component';
import { CommonModule } from '@angular/common';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { deleteObject } from '@angular/fire/storage';
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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-preview',
  standalone: true,
  imports: [CourseComponent, CommonModule, FormsModule],
  templateUrl: './course-preview.component.html',
  styleUrl: './course-preview.component.css',
})
export class CoursePreviewComponent implements OnInit, OnDestroy {
  course?: Course | null = null;
  userCanEdit: boolean = false;
  private authStateSub!: Unsubscribe;
  private courseDataSub!: Subscription;
  selectedFile: File | null = null;
  selectedDiv: 'firstDivFiles' | 'secondDivFiles' | null = null;
  customFileName: string = '';

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

  cancelFileSelection() {
    this.selectedFile = null;
    this.customFileName = '';
    this.selectedDiv = null;
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
          this.adjustDivHeight('firstDivFiles');
          this.adjustDivHeight('secondDivFiles');
        } else {
          console.error('Course not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching course:', error);
      });
  }

  onFileSelected(event: any, divField: 'firstDivFiles' | 'secondDivFiles') {
    this.selectedFile = event.target.files[0];
    this.selectedDiv = divField;
  }

  async uploadFileWithCustomName(divField: 'firstDivFiles' | 'secondDivFiles') {
    if (this.selectedFile && this.customFileName && this.course) {
      const storageRef = ref(
        this.storage,
        `courseFiles/${this.course.courseId}/${this.selectedFile.name}`
      );
      await uploadBytes(storageRef, this.selectedFile);
      const downloadUrl = await getDownloadURL(storageRef);

      const fileEntry = {
        url: downloadUrl,
        displayName: this.customFileName,
      };

      const updatedFiles = [...(this.course[divField] || []), fileEntry];
      const courseDocRef = doc(
        this.firestore,
        `courses/${this.course.courseId}`
      );
      await updateDoc(courseDocRef, { [divField]: updatedFiles });

      this.selectedFile = null;
      this.customFileName = '';
      this.selectedDiv = null;
      this.adjustDivHeight(divField);

      this.loadCourse(this.course.courseId);
    }
  }

  adjustDivHeight(divField: 'firstDivFiles' | 'secondDivFiles') {
    const filesCount = this.course?.[divField]?.length || 0;
    const minHeight = 30;
    const heightPerFile = 5;

    const containerClass =
      divField === 'firstDivFiles'
        ? '.first-div-container'
        : '.second-div-container';

    const container = document.querySelector(containerClass);

    if (container) {
      const newHeight = Math.max(
        minHeight,
        minHeight + filesCount * heightPerFile
      );
      (container as HTMLElement).style.height = `${newHeight}vh`;

      console.log(`New height for ${divField}: ${newHeight}vh`);
    } else {
      console.warn(`Container not found for ${divField}`);
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

  async deleteFile(
    fileUrl: string,
    divField: 'firstDivFiles' | 'secondDivFiles'
  ) {
    if (this.course && this.course.courseId) {
      try {
        console.log('File URL to delete:', fileUrl);

        const updatedFiles = (this.course[divField] || []).filter(
          (file: { url: string; displayName: string }) => file.url !== fileUrl
        );

        const courseDocRef = doc(
          this.firestore,
          `courses/${this.course.courseId}`
        );
        await updateDoc(courseDocRef, { [divField]: updatedFiles });

        this.course[divField] = updatedFiles;

        this.adjustDivHeight(divField);

        console.log(
          'File reference successfully deleted from Firestore and height adjusted.'
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error deleting file reference:', error.message);
        } else {
          console.error(
            'An unknown error occurred while deleting the file reference.'
          );
        }
      }
    }
  }
}
