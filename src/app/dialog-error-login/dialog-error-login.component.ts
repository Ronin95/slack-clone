import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-error-login',
  templateUrl: './dialog-error-login.component.html',
  styleUrls: ['./dialog-error-login.component.scss']
})
export class DialogErrorLoginComponent {
  constructor(public dialog: MatDialog) {}
}
