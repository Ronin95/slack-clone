import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from './dialog-user-info/dialog-user-info.component';
import {
	AngularFirestore,
	AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject, filter, debounceTime, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ChannelService } from '../services/channel.service';
import { UsersService } from '../services/users.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	constructor(
		public dialog: MatDialog,
		private afs: AngularFirestore,
		public authService: AuthService,
		private afAuth: AngularFireAuth,
		public channelService: ChannelService,
		private usersService: UsersService
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
