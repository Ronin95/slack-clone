import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { UsersService } from '../services/users.service';

@Component({
	selector: 'app-send-message',
	templateUrl: './send-message.component.html',
	styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit {
	// allUsers!: Array<any>;
	allUsers$ = this.usersService.getUsers;
	user!: any;

	constructor(private usersService: UsersService) {
		// Assign the resolved value to the property
	}

	// console.log(this.user$);

	async ngOnInit(): Promise<void> {
		this.usersService.currentUserProfile$.subscribe((user) => {
			this.user = user;
		});
	}
}
