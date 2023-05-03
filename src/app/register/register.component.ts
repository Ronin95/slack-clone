import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
// import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {
  }

  public registerForm: FormGroup;

  // , public authService: AuthService
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<RegisterComponent>, public dialog: MatDialog) {
    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators.required], []],
      email: ['', [Validators.required, Validators.email], []],
      password: ['', [Validators.required], []]
    })
  }


  closeDialog() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent);
  }

}
