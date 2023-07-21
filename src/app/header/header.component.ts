import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from './dialog-user-info/dialog-user-info.component';
import { AuthService } from '../services/auth.service';
import { ChannelService } from '../services/channel.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	constructor(
		public dialog: MatDialog,
		public authService: AuthService,
		public channelService: ChannelService,
	) {
	}

 /**
  * The `ngOnInit()` method is a lifecycle hook in Angular that is called after the component has been initialized. In this
  * code, the `ngOnInit()` method is being used to call the `authenticateUserGetImg()` method from the `AuthService`
  * service. This method is responsible for authenticating the user and retrieving their profile image.
  * 
  * @method
  * @name ngOnInit
  * @kind method
  * @memberof HeaderComponent
  * @returns {void}
  */
	ngOnInit() {
		this.authService.authenticateUserGetImg();
	}

 /**
  * The `openUserDialog()` method is a function that is called when a user clicks on a button or performs a specific action.
  * It opens a dialog box using the `MatDialog` service from Angular Material.
  * 
  * @method
  * @name openUserDialog
  * @kind method
  * @memberof HeaderComponent
  * @returns {void}
  */
	openUserDialog(): void {
		const screenWidth = window.innerWidth;
		const dialogWidth = (screenWidth >= 500) ? '250px' : '200px';
		this.dialog.open(DialogUserInfoComponent, {
			width: dialogWidth,
			position: { right: '10px', top: '45px' },
		});
	}
}
