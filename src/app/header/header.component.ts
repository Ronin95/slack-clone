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

	ngOnInit() {
		this.authService.authenticateUserGetImg();
	}

	openUserDialog(): void {
		this.dialog.open(DialogUserInfoComponent, {
			width: '250px',
			position: { right: '10px', top: '45px' },
		});
	}
}
