import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { DialogErrorLoginComponent } from '../dialog-error-login/dialog-error-login.component';
// import { AuthService } from '../services/auth.service'; Kommt noch

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  // , public authService: AuthService
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

  openDialogForgotPassword() {
    this.dialog.open(ForgotPasswordComponent)
  }

  ngOnInit(): void {}
}
