import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    public authService: AuthService
  ) {}

  openLogin() {
    this.dialog.open(LoginComponent);
    this.dialogRef.close();
  }
}
