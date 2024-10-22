import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-community-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Enter Community Name</h2>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Community Name</mat-label>
        <input matInput [(ngModel)]="communityName" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button [mat-dialog-close]="communityName" cdkFocusInitial>
        Confirm
      </button>
    </div>
  `,
})
export class AddCommunityDialogComponent {
  communityName: string = '';

  constructor(public dialogRef: MatDialogRef<AddCommunityDialogComponent>) {}

  onCancel(): void {
    //test
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.communityName) {
      this.dialogRef.close(this.communityName);
    } else {
      console.error('Community name is empty!');
    }
  }
}
