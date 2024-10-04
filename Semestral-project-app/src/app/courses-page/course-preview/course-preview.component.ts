import { Component, OnInit } from '@angular/core';
import { Course } from '../course/course.model';
import { ActivatedRoute } from '@angular/router';
import { CourseComponent } from '../course/course.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-course-preview',
  standalone: true,
  imports: [CourseComponent, CommonModule],
  templateUrl: './course-preview.component.html',
  styleUrl: './course-preview.component.css',
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
      console.log('Title from params:', title);
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

  loadCourse(title: string): void {
    const allCourses = [
      ...this.courses,
      ...this.courses2,
      ...this.courses3,
      ...this.courses4,
    ];
    const foundCourse = allCourses.find((course) => course.title === title);
    if (foundCourse) {
      this.course = foundCourse;
      console.log('Found course:', this.course);
    } else {
      console.error('Course not found');
    }
  }

  courses: Course[] = [
    {
      courseId: 'Machine-Learning',
      imageSrc: '../../assets/ML.webp',
      title: 'Machine-Learning',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
    {
      courseId: 'Deep-Learning',
      imageSrc: '../../assets/DL.webp',
      title: 'Deep-Learning',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
    {
      courseId: 'Algorithms',
      imageSrc: '../../assets/algo.webp',
      title: 'Algorithms',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
  ];

  courses2: Course[] = [
    {
      courseId: 'Computational-Models',
      imageSrc: '../../assets/CM.webp',
      title: 'Computational-Models',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
    {
      courseId: 'Artificial-Inteligence',
      imageSrc: '../../assets/AI.webp',
      title: 'Artificial-Inteligence',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
    {
      courseId: 'Data-Structures',
      imageSrc: '../../assets/DS.webp',
      title: 'Data-Structures',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
  ];

  courses3: Course[] = [
    {
      courseId: 'Operating-Systems',
      imageSrc: '../../assets/OS.webp',
      title: 'Operating-Systems',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
    {
      courseId: 'Software-Engineering',
      imageSrc: '../../assets/SWE.webp',
      title: 'Software-Engineering',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
    {
      courseId: 'Discrete-Mathematics',
      imageSrc: '../../assets/DM.webp',
      title: 'Discrete-Mathematics',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
  ];

  courses4: Course[] = [
    {
      courseId: 'Calculus',
      imageSrc: '../../assets/calc.webp',
      title: 'Calculus',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
    {
      courseId: 'Algebra',
      imageSrc: '../../assets/algebra.webp',
      title: 'Algebra',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
    {
      courseId: 'Probability-Theory',
      imageSrc: '../../assets/prob.webp',
      title: 'Probability-Theory',
      cssClass: 'CourseClass',
      maxStudents: 80,
      currentStudents: 50,
      teacherName: 'Jane Smith',
    },
  ];
}
