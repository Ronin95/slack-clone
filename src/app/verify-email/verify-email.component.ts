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

  /**
   * The `openLogin()` method is a function defined in the `VerifyEmailComponent` class. It is used to open a login dialog
   * box by calling the `open()` method of the `MatDialog` service. After opening the login dialog, it also closes the
   * current dialog box (`VerifyEmailComponent`) by calling the `close()` method of the `MatDialogRef` service.
   * 
   * @method
   * @name openLogin
   * @kind method
   * @memberof VerifyEmailComponent
   * @returns {void}
   */
  openLogin() {
    this.dialog.open(LoginComponent);
    this.dialogRef.close();
  }
}
