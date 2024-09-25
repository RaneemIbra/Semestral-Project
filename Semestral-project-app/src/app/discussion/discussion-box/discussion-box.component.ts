import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-discussion-box',
  standalone: true,
  imports: [CommonModule, MatDialogModule, DialogComponent],
  templateUrl: './discussion-box.component.html',
  styleUrls: ['./discussion-box.component.css'],
})
export class DiscussionBoxComponent implements OnInit {
  @Input() title: string = '';
  divs: {
    left: number;
    top: number;
    id: string;
    divTitle: string;
    text?: string;
  }[] = [];
  activeDivId: string | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private dialog: MatDialog
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

  openDialogTest() {
    this.dialog.open(DialogComponent, {
      width: '400px',
      height: '350px',
      data: { title: 'Modern Dialog' },
    });
  }

  loadDiscussionBox(community: string): void {
    const discussionBoxCollection = collection(
      this.firestore,
      `discussion-boxes/${community}/divs`
    );

    getDocs(discussionBoxCollection)
      .then((snapshot) => {
        this.divs = snapshot.docs.map((doc) => {
          const data = doc.data() as {
            left: number;
            top: number;
            divTitle: string;
            text: string;
          };
          return {
            left: data.left,
            top: data.top,
            id: doc.id,
            divTitle: data.divTitle || '',
            text: data.text || '',
          };
        });
      })
      .catch((error) => {
        console.error('Error loading discussion box:', error);
      });
  }

  saveDiscussionBox(
    divId: string,
    left: number,
    top: number,
    divTitle: string,
    text: string
  ): void {
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      const discussionBoxDoc = doc(
        this.firestore,
        `discussion-boxes/${this.title}/divs/${divId}`
      );

      setDoc(discussionBoxDoc, { left, top, divTitle, text })
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
        const div = this.divs[divIndex];
        this.saveDiscussionBox(
          divId,
          div.left,
          div.top,
          div.divTitle || '',
          div.text || ''
        );
      }
    }
  }

  addDiv(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: 'Enter note details',
        divTitle: '',
        text: '',
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.divTitle && result.text) {
        const newDiv = {
          left: 0,
          top: 0,
          id: (this.divs.length + 1).toString(),
          divTitle: result.divTitle,
          text: result.text,
        };

        addDoc(
          collection(this.firestore, `discussion-boxes/${this.title}/divs`),
          newDiv
        )
          .then((docRef) => {
            this.divs.push({ ...newDiv, id: docRef.id });
          })
          .catch((error) => {
            console.error('Error adding div: ', error);
          });
      } else {
        console.error('Title or text missing. Div was not added.');
      }
    });
  }

  openDialog(divId: string): void {
    const divIndex = this.divs.findIndex((div) => div.id === divId);
    if (divIndex >= 0) {
      const divData = this.divs[divIndex];

      const dialogRef = this.dialog.open(DialogComponent, {
        width: '400px',
        data: {
          title: divData.divTitle || 'No title',
          text: divData.text,
          mode: 'view',
        },
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.delete) {
          this.deleteDiv(divId, divIndex);
        } else if (result) {
          this.divs[divIndex].divTitle = result.divTitle;
          this.divs[divIndex].text = result.text;

          this.saveDiscussionBox(
            divId,
            divData.left,
            divData.top,
            result.divTitle,
            result.text
          );
        }
      });
    }
  }

  deleteDiv(divId: string, divIndex: number): void {
    const discussionBoxDoc = doc(
      this.firestore,
      `discussion-boxes/${this.title}/divs/${divId}`
    );
    deleteDoc(discussionBoxDoc)
      .then(() => {
        console.log('Div deleted from Firestore');
        this.divs.splice(divIndex, 1);
      })
      .catch((error) => {
        console.error('Error deleting div from Firestore:', error);
      });
  }
}
