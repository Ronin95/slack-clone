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
	isLoading = false;
	results$!: Observable<any>;
	input$ = new Subject<string>();

	messages!: any[];
	filteredMessages$!: Observable<any[]>;

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
		this.channelService
			.fetchMessagesFromFirebase('KSixrcy1b2zNV9Rah30m')
			.subscribe((messages) => {
				this.messages = messages;
				console.log(messages);
			});
	}

	searchInput() {
		this.filteredMessages$ = this.input$.pipe(
			debounceTime(500),
			distinctUntilChanged(),
			filter((term) => term.length > 3),
			switchMap((term) =>
				of(this.messages).pipe(
					map((messages) =>
						messages.filter((message) => message.message.includes(term))
					)
				)
			)
		);

		this.filteredMessages$.subscribe((filteredMessages) => {
			this.filteredMessages$ = of(filteredMessages);
			console.log(this.filteredMessages$);
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
