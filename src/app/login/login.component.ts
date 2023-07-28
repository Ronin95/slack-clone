import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public authService: AuthService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email], []],
      password: ['', [Validators.required], []],
    });
  }

  /**
   * The `openDialogForgotPassword()` method is responsible for opening a dialog box for the "Forgot Password" functionality.
   * When called, it opens the `ForgotPasswordComponent` dialog using the `MatDialog` service.
   * 
   * @method
   * @name openDialogForgotPassword
   * @kind method
   * @memberof LoginComponent
   * @returns {void}
   */
  openDialogForgotPassword() {
    this.dialog.open(ForgotPasswordComponent)
  }

  ngOnInit() {}
}
