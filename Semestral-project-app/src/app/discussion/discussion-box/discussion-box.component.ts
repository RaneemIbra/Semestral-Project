import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../dialog/dialog.component';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-discussion-box',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './discussion-box.component.html',
  styleUrls: ['./discussion-box.component.css'],
})
export class DiscussionBoxComponent implements OnInit {
  @Input() title: string = '';
  divs: { left: number; top: number; id: string }[] = [];
  activeDivId: string | null = null;

  constructor(
    private dialog: MatDialog,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.loadDiscussionBox(this.title);
    console.log(this.title);
  }

  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private initialX = 0;
  private initialY = 0;
  private moveElement: HTMLElement | null = null;

  loadDiscussionBox(community: string): void {
    const discussionBoxCollection = collection(
      this.firestore,
      `discussion-boxes/${community}/divs`
    );

    getDocs(discussionBoxCollection)
      .then((snapshot) => {
        this.divs = snapshot.docs.map((doc) => {
          const data = doc.data() as { left: number; top: number };
          return {
            left: data.left,
            top: data.top,
            id: doc.id,
          };
        });
        console.log('Discussion box loaded:', this.divs);
      })
      .catch((error) => {
        console.error('Error loading discussion box:', error);
      });
  }

  saveDiscussionBox(divId: string, left: number, top: number): void {
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      console.log('User is authenticated with UID:', currentUser.uid);

      const discussionBoxDoc = doc(
        this.firestore,
        `discussion-boxes/${this.title}/divs/${divId}`
      );
      console.log(
        `Saving to path: discussion-boxes/${this.title}/divs/${divId}`
      );

      setDoc(discussionBoxDoc, { left, top })
        .then(() => {
          console.log('Discussion box saved successfully!');
        })
        .catch((error) => {
          console.error('Error saving discussion box:', error);
        });
    } else {
      console.error('User is not authenticated!');
    }
  }

  onDivClick(divId: string): void {
    if (this.activeDivId === divId) {
      this.activeDivId = null;
    } else {
      this.activeDivId = divId;
    }
  }

  onMouseDown(event: MouseEvent, divId: string): void {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.moveElement = event.target as HTMLElement;

    const divIndex = this.divs.findIndex((div) => div.id === divId);

    if (this.moveElement && divIndex >= 0) {
      const rect = this.moveElement.getBoundingClientRect();
      const parentRect =
        this.moveElement.parentElement!.getBoundingClientRect();
      this.initialX = rect.left - parentRect.left;
      this.initialY = rect.top - parentRect.top;
    }

    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.moveElement) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    let newLeft = this.initialX + deltaX;
    let newTop = this.initialY + deltaY;

    const parentRect = this.moveElement.parentElement!.getBoundingClientRect();
    const moveRect = this.moveElement.getBoundingClientRect();

    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + moveRect.width > parentRect.width)
      newLeft = parentRect.width - moveRect.width;
    if (newTop + moveRect.height > parentRect.height)
      newTop = parentRect.height - moveRect.height;

    this.moveElement.style.left = `${newLeft}px`;
    this.moveElement.style.top = `${newTop}px`;

    const divId = this.moveElement.getAttribute('data-div-id');
    const divIndex = this.divs.findIndex((div) => div.id === divId);
    if (divIndex >= 0) {
      this.divs[divIndex].left = newLeft;
      this.divs[divIndex].top = newTop;
    }

    event.preventDefault();
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    this.isDragging = false;

    if (this.moveElement) {
      const divId = this.moveElement.getAttribute('data-div-id') || '';
      const divIndex = this.divs.findIndex((div) => div.id === divId);
      if (divIndex >= 0) {
        this.saveDiscussionBox(
          divId,
          this.divs[divIndex].left,
          this.divs[divIndex].top
        );
      }
    }
  }

  addDiv(): void {
    const newDiv = { left: 0, top: 0, id: (this.divs.length + 1).toString() };

    addDoc(
      collection(this.firestore, `discussion-boxes/${this.title}/divs`),
      newDiv
    )
      .then((docRef) => {
        console.log('Added new div with ID: ', docRef.id);
        this.divs.push({ ...newDiv, id: docRef.id });
      })
      .catch((error) => {
        console.error('Error adding div: ', error);
      });
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '200px',
      height: '200px',
      data: { title: 'Discussion Box' },
      disableClose: false,
      hasBackdrop: true,
      autoFocus: true,
    });
  }
}
