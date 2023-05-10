import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  Firestore,
} from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  firestore: Firestore = inject(Firestore);

  public registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegisterComponent>,
    public dialog: MatDialog /* public authService: AuthService */ /* private firestore: AngularFirestore */,
    public authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators.required], []],
      email: ['', [Validators.required, Validators.email], []],
      password: ['', [Validators.required], []],
    });
  }

  closeDialog() {
    if (!this.authService.errorMsgRegister) {
      this.dialogRef.close();
      this.dialog.open(VerifyEmailComponent);
    }
  }
}
