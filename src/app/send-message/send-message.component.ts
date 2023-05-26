import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Component({
	selector: 'app-send-message',
	templateUrl: './send-message.component.html',
	styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit {
	// allUsers!: Array<any>;
	allUsers$ = this.usersService.getUsers;

	constructor(private usersService: UsersService) {
		/* 	this.service.getUsers.subscribe((users) => {
			this.allUsers = users;

		}); */
	}

	async ngOnInit(): Promise<void> {}
}
