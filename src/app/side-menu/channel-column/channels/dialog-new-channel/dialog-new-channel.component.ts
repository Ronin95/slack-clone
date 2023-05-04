import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-new-channel',
  templateUrl: './dialog-new-channel.component.html',
  styleUrls: ['./dialog-new-channel.component.scss'],
})
export class DialogNewChannelComponent {
  constructor(public dialogRef: MatDialogRef<DialogNewChannelComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
