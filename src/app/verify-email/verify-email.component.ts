import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  constructor(public authService: AuthService, public dialog: MatDialog, public dialogRef: MatDialogRef<VerifyEmailComponent>) {}

  openLogin() {
    this.dialog.open(LoginComponent);
    this.dialogRef.close();
  }
}
