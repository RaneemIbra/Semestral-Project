import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
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
  divs: { left: number; top: number; id: string; text?: string }[] = [];
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
            text?: string;
          };
          return {
            left: data.left,
            top: data.top,
            id: doc.id,
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
    text?: string
  ): void {
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      const discussionBoxDoc = doc(
        this.firestore,
        `discussion-boxes/${this.title}/divs/${divId}`
      );

      setDoc(discussionBoxDoc, { left, top, text })
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
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title: 'Enter note text', text: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newDiv = {
          left: 0,
          top: 0,
          id: (this.divs.length + 1).toString(),
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
      }
    });
  }

  openDialog(divId: string): void {
    const divIndex = this.divs.findIndex((div) => div.id === divId);
    if (divIndex >= 0) {
      const divData = this.divs[divIndex];

      const width = 400;
      const height = 400;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      const dialogWindow = window.open(
        '',
        '_blank',
        `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no`
      );

      if (dialogWindow) {
        dialogWindow.document.write(`
          <html>
            <head>
              <title>Discussion Box</title>
              <style>
                body {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                  margin: 0;
                  font-family: Arial, sans-serif;
                  background-color: #fafafa;
                }
                .dialog-title {
                  font-size: 24px;
                  margin-bottom: 20px;
                }
                .dialog-content {
                  font-size: 16px;
                  margin-bottom: 20px;
                  text-align: center;
                }
                .dialog-actions {
                  display: flex;
                  justify-content: center;
                }
                button {
                  padding: 10px 20px;
                  background-color: #fa1e4e;
                  border: none;
                  color: white;
                  cursor: pointer;
                }
                button:hover {
                  background-color: #d41842;
                }
              </style>
            </head>
            <body>
              <div class="dialog-title">Discussion Box</div>
              <div class="dialog-content">
                ${
                  divData.text ? divData.text : 'No text provided for this div.'
                }
              </div>
              <div class="dialog-actions">
                <button onclick="window.close()">Close</button>
              </div>
            </body>
          </html>
        `);
      }
    }
  }
}
