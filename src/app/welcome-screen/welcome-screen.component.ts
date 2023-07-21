import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss'],
})
export class WelcomeScreenComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  /**
   * The `openLogin()` method is responsible for opening a dialog box that displays the LoginComponent.
   * 
   * @method
   * @name openLogin
   * @kind method
   * @memberof WelcomeScreenComponent
   * @returns {void}
   */
  openLogin() {
    this.dialog.open(LoginComponent);
  }

  /**
   * The `openSignUp()` method is responsible for opening a dialog box that displays the RegisterComponent.
   * 
   * @method
   * @name openSignUp
   * @kind method
   * @memberof WelcomeScreenComponent
   * @returns {void}
   */
  openSignUp() {
    this.dialog.open(RegisterComponent);
  }
}
