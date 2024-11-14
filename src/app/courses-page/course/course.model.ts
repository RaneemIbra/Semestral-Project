export interface Course {
  courseId: string;
  imageSrc: string;
  title: string;
  cssClass: string;
  maxStudents: number;
  currentStudents: number;
  teacherName: string;
  firstDivFiles?: { url: string; displayName: string }[];
  secondDivFiles?: { url: string; displayName: string }[];
}
