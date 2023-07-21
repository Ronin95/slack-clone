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

  /**
   * The `openLogin()` method is responsible for opening the login dialog and closing the current forgot password dialog. It
   * achieves this by calling the `open()` method of the `MatDialog` service to open the `LoginComponent` dialog and then
   * calling the `close()` method of the `MatDialogRef` to close the current `ForgotPasswordComponent` dialog.
   * 
   * @method
   * @name openLogin
   * @kind method
   * @memberof ForgotPasswordComponent
   * @returns {void}
   */
  openLogin() {
    this.dialog.open(LoginComponent);
    this.dialogRef.close();
  }
}
