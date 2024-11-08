import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  getDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-discussion-box',
  standalone: true,
  imports: [CommonModule, MatDialogModule, DialogComponent],
  templateUrl: './discussion-box.component.html',
  styleUrls: ['./discussion-box.component.css'],
})
export class DiscussionBoxComponent implements OnInit {
  @Input() title: string = '';
  @Input() userId: string | null = null;
  @Input() isProfileMode: boolean = false;
  userName: string = '';
  divs: {
    left: number;
    top: number;
    id: string;
    divTitle: string;
    text?: string;
    creatorName: string;
  }[] = [];
  activeDivId: string | null = null;

  arrows: {
    fromDivId: string;
    toDivId: string;
  }[] = [];

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    const authUser = this.auth.currentUser;
    if (authUser) {
      this.userId = authUser.uid;
      console.log('User ID:', this.userId);
      await this.getUserInfo(this.userId);

      if (this.isProfileMode && this.userId) {
        this.loadUserDetectiveBoard(this.userId);
      } else {
        this.loadDiscussionBox(this.title);
      }
    } else {
      console.log('No authenticated user found.');
    }
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

  loadUserDetectiveBoard(userId: string): void {
    const discussionBoxCollection = collection(
      this.firestore,
      `users/${userId}/detective-board`
    );
    const arrowsCollection = collection(
      this.firestore,
      `users/${userId}/arrows`
    );

    getDocs(discussionBoxCollection)
      .then((snapshot) => {
        this.divs = snapshot.docs.map((doc) => {
          const data = doc.data() as {
            left: number;
            top: number;
            divTitle: string;
            text: string;
            creatorName: string;
          };
          return {
            left: data.left,
            top: data.top,
            id: doc.id,
            divTitle: data.divTitle || '',
            text: data.text || '',
            creatorName: data.creatorName || 'Unknown',
          };
        });

        return getDocs(arrowsCollection);
      })
      .then((snapshot) => {
        this.arrows = snapshot.docs
          .map((doc) => {
            const data = doc.data() as {
              fromDivId: string;
              toDivId: string;
            };

            if (
              this.divs.find((div) => div.id === data.fromDivId) &&
              this.divs.find((div) => div.id === data.toDivId)
            ) {
              return { fromDivId: data.fromDivId, toDivId: data.toDivId };
            } else {
              this.deleteArrowFromFirestore(data);
              return null;
            }
          })
          .filter(
            (arrow): arrow is { fromDivId: string; toDivId: string } =>
              arrow !== null
          );

        this.drawArrows();
      })
      .catch((error) => {
        console.error('Error loading detective board:', error);
      });
  }

  loadDiscussionBox(community: string): void {
    const discussionBoxCollection = collection(
      this.firestore,
      `discussion-boxes/${community}/divs`
    );
    const arrowsCollection = collection(
      this.firestore,
      `discussion-boxes/${community}/arrows`
    );

    getDocs(discussionBoxCollection)
      .then((snapshot) => {
        this.divs = snapshot.docs.map((doc) => {
          const data = doc.data() as {
            left: number;
            top: number;
            divTitle: string;
            text: string;
            creatorName: string;
          };
          return {
            left: data.left,
            top: data.top,
            id: doc.id,
            divTitle: data.divTitle || '',
            text: data.text || '',
            creatorName: data.creatorName || 'Unknown',
          };
        });

        return getDocs(arrowsCollection);
      })
      .then((snapshot) => {
        this.arrows = snapshot.docs
          .map((doc) => {
            const data = doc.data() as {
              fromDivId: string;
              toDivId: string;
            };

            if (
              this.divs.find((div) => div.id === data.fromDivId) &&
              this.divs.find((div) => div.id === data.toDivId)
            ) {
              return { fromDivId: data.fromDivId, toDivId: data.toDivId };
            } else {
              this.deleteArrowFromFirestore(data);
              return null;
            }
          })
          .filter(
            (arrow): arrow is { fromDivId: string; toDivId: string } =>
              arrow !== null
          );

        this.drawArrows();
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
    text: string,
    creatorName: string
  ): void {
    const collectionPath =
      this.isProfileMode && this.userId
        ? `users/${this.userId}/detective-board`
        : `discussion-boxes/${this.title}/divs`;

    const discussionBoxDoc = doc(this.firestore, `${collectionPath}/${divId}`);

    setDoc(discussionBoxDoc, { left, top, divTitle, text, creatorName })
      .then(() => {
        console.log('Discussion box saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving discussion box:', error);
      });
  }

  saveArrow(fromDivId: string, toDivId: string): void {
    const arrowPath =
      this.isProfileMode && this.userId
        ? `users/${this.userId}/arrows`
        : `discussion-boxes/${this.title}/arrows`;

    const newArrow = { fromDivId, toDivId };

    addDoc(collection(this.firestore, arrowPath), newArrow).then(() => {
      console.log('Arrow saved successfully!');
    });
  }

  onDivClick(divId: string): void {
    if (this.activeDivId === divId) {
      this.activeDivId = null;
    } else {
      this.activeDivId = divId;
    }
  }

  drawArrows(): void {
    this.arrows = [...this.arrows];
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

    const sidebarWidth = 5 * (window.innerWidth / 100);

    if (newLeft < sidebarWidth) newLeft = sidebarWidth;
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

      this.drawArrows();
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
          div.text || '',
          div.creatorName
        );
      }
    }
  }

  async addDiv(): Promise<void> {
    if (!this.userId) {
      console.error('User ID is null. Cannot add div.');
      return;
    }

    if (!this.userName) {
      await this.getUserInfo(this.userId);
    }

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
          left: 5 * (window.innerWidth / 100),
          top: 0,
          id: (this.divs.length + 1).toString(),
          divTitle: result.divTitle,
          text: result.text,
          creatorName: this.userName,
        };

        const collectionPath =
          this.isProfileMode && this.userId
            ? `users/${this.userId}/detective-board`
            : `discussion-boxes/${this.title}/divs`;

        addDoc(collection(this.firestore, collectionPath), newDiv)
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
          userName: divData.creatorName,
        },
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.delete) {
          this.deleteDiv(divId, divIndex);
        } else if (result?.buildOn) {
          this.openAddDivDialogWithArrow(divId);
        } else if (result) {
          this.divs[divIndex].divTitle = result.divTitle;
          this.divs[divIndex].text = result.text;

          this.saveDiscussionBox(
            divId,
            divData.left,
            divData.top,
            result.divTitle,
            result.text,
            result.userName
          );
        }
      });
    }
  }

  openAddDivDialogWithArrow(fromDivId: string): void {
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
        const finalText = result.text.includes(`Added by: ${this.userName}`)
          ? result.text
          : `${result.text}\nAdded by: ${this.userName}`;

        const newDiv = {
          left: 5 * (window.innerWidth / 100),
          top: 0,
          id: (this.divs.length + 1).toString(),
          divTitle: result.divTitle,
          text: finalText,
          creatorName: this.userName,
        };

        const collectionPath =
          this.isProfileMode && this.userId
            ? `users/${this.userId}/detective-board`
            : `discussion-boxes/${this.title}/divs`;

        addDoc(collection(this.firestore, collectionPath), newDiv)
          .then((docRef) => {
            this.divs.push({ ...newDiv, id: docRef.id });
            this.arrows.push({ fromDivId, toDivId: docRef.id });
            this.drawArrows();
            this.saveArrow(fromDivId, docRef.id);
          })
          .catch((error) => {
            console.error('Error adding div: ', error);
          });
      } else {
        console.error('Title or text missing. Div was not added.');
      }
    });
  }

  deleteDiv(divId: string, divIndex: number): void {
    const collectionPath =
      this.isProfileMode && this.userId
        ? `users/${this.userId}/detective-board/${divId}`
        : `discussion-boxes/${this.title}/divs/${divId}`;

    const discussionBoxDoc = doc(this.firestore, collectionPath);

    deleteDoc(discussionBoxDoc)
      .then(() => {
        console.log('Div deleted from Firestore');

        this.divs.splice(divIndex, 1);

        const relatedArrows = this.arrows.filter(
          (arrow) => arrow.fromDivId === divId || arrow.toDivId === divId
        );

        relatedArrows.forEach((arrow) => {
          this.deleteArrowFromFirestore(arrow);
        });

        this.arrows = this.arrows.filter(
          (arrow) => arrow.fromDivId !== divId && arrow.toDivId !== divId
        );

        this.drawArrows();
      })
      .catch((error) => {
        console.error('Error deleting div from Firestore:', error);
      });
  }

  deleteArrowFromFirestore(arrow: {
    fromDivId: string;
    toDivId: string;
  }): void {
    const collectionPath =
      this.isProfileMode && this.userId
        ? `users/${this.userId}/arrows/${arrow.fromDivId}_${arrow.toDivId}`
        : `discussion-boxes/${this.title}/arrows/${arrow.fromDivId}_${arrow.toDivId}`;

    const arrowDoc = doc(this.firestore, collectionPath);
    deleteDoc(arrowDoc)
      .then(() => {
        console.log('Arrow deleted from Firestore');
      })
      .catch((error) => {
        console.error('Error deleting arrow from Firestore:', error);
      });
  }

  getDivCenterX(divId: string): number {
    const div = this.divs.find((d) => d.id === divId);
    if (div) {
      return div.left + (6 * window.innerWidth) / 100 / 2;
    }
    return 0;
  }

  getDivCenterY(divId: string): number {
    const div = this.divs.find((d) => d.id === divId);
    if (div) {
      return div.top + (8 * window.innerHeight) / 100 / 2;
    }
    return 0;
  }

  async getUserInfo(userId: string | null): Promise<void> {
    if (!userId) {
      console.error('User ID is null. Cannot fetch user info.');
      this.userName = 'Unknown';
      return;
    }

    try {
      const userDocRef = doc(this.firestore, `users/${userId}`);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        this.userName = userData['name'] || 'Unknown';
        console.log('Fetched user name:', this.userName);
      } else {
        console.log('User not found');
        this.userName = 'Unknown';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.userName = 'Unknown';
    }
  }
}
