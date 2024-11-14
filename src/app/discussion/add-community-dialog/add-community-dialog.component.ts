import { Component } from '@angular/core';
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
  templateUrl: './add-community-dialog.component.html',
  styleUrls: ['./add-community-dialog.component.css'],
})
export class AddCommunityDialogComponent {
  communityName: string = '';

  constructor(public dialogRef: MatDialogRef<AddCommunityDialogComponent>) {}

  onCancel(): void {
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
