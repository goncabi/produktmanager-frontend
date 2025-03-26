import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="dialog-content">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>{{ data.message }}</mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-raised-button (click)="onCancel()">Abbrechen</button>
        <button mat-flat-button color="warn" (click)="onConfirm()">Löschen</button>
      </mat-dialog-actions>
    </div>
  `,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  styles: [`
    .dialog-content {
      padding: 10px;
      min-width: 300px;
    }

    h2 {
      margin-bottom: 12px;
    }

    mat-dialog-content {
      margin-bottom: 20px;
      font-size: 15px;
    }

    mat-dialog-actions {
      margin-top: 16px;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
