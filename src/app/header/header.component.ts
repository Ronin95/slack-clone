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
	filteredMessagesArray: any[] = [];

	users$ = this.usersService.getUsers;
	channelID?: string;

	constructor(
		public dialog: MatDialog,
		private afs: AngularFirestore,
		public authService: AuthService,
		private afAuth: AngularFireAuth,
		private channelService: ChannelService,
		private usersService: UsersService
	) {
		this.searchInput();
		/* 		this.channelService
			.fetchMessagesFromFirebase(this.channelID!)
			.subscribe((messages) => {
				this.messages = messages;
				console.log(messages);
			}); */
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
			this.filteredMessagesArray = filteredMessages;
			console.log(this.filteredMessagesArray);
		});
	}

	ngOnInit() {
		this.authService.authenticateUserGetImg();
		this.getChannelID();
	}

	openUserDialog(): void {
		this.dialog.open(DialogUserInfoComponent, {
			width: '250px',
			position: { right: '10px', top: '45px' },
		});
	}

	getChannelID() {
		this.channelService.currentChannelID$.subscribe((channelID) => {
			this.channelID = channelID;
			console.log('channelid in header', this.channelID);

			// Fetch messages inside the subscription
			this.channelService
				.fetchMessagesFromFirebase(this.channelID!)
				.subscribe((messages) => {
					this.messages = messages;
					console.log(messages);
				});
		});
	}
}
