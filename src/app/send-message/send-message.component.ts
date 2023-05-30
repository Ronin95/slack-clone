import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { UsersService } from '../services/users.service';

@Component({
	selector: 'app-send-message',
	templateUrl: './send-message.component.html',
	styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit {
	// allUsers!: Array<any>;
	otherUsers$ = this.usersService.getUsers;
	loggedInUser!: any;

	currentUserProfile$!: any;

	constructor(private usersService: UsersService) {
		// Assign the resolved value to the property
	}

	// console.log(this.user$);

	async ngOnInit(): Promise<void> {
		this.usersService.currentUserProfile$.subscribe((user) => {
			this.loggedInUser = user;
			console.log('auth', this.loggedInUser.uid);

			this.otherUsers$ = this.usersService.getUsers.pipe(
				map((users) => {
					return users.filter((user) => user.uid !== this.loggedInUser.uid);
				})
			);
		});
	}
}
