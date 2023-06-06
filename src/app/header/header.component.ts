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
import { distinctUntilChanged } from 'rxjs/operators';
import { ChannelService } from '../services/channel.service';
import { UsersService } from '../services/users.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	isLoading = false;
	results$!: Observable<any>;
	input$ = new Subject<string>();

	messages!: any;
	users$ = this.usersService.getUsers;

	constructor(
		public dialog: MatDialog,
		private afs: AngularFirestore,
		public authService: AuthService,
		private afAuth: AngularFireAuth,
		private channelService: ChannelService,
		private usersService: UsersService
	) {
		this.searchInput();
		this.messages = this.channelService
			.fetchMessagesFromFirebase('KSixrcy1b2zNV9Rah30m')
			.subscribe((data) => {
				this.messages = of(data);
				console.log(this.messages); // ist ein Observable, nicht messages.
			});
	}

	searchInput() {
		this.input$
			.pipe(
				filter((term) => term.length > 3),
				debounceTime(500), // wait 500ms after the last event before emitting last event
				distinctUntilChanged((a, b) => {
					// only emit if value is different from previous value
					return JSON.stringify(a) === JSON.stringify(b);
				})
			)
			.subscribe((term) => {
				console.log(term);
			});
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
