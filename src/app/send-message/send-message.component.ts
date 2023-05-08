import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { UsersService } from '../services/users.service';

@Component({
	selector: 'app-send-message',
	templateUrl: './send-message.component.html',
	styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit {
	allUsers: User[] = [];

	constructor(private service: UsersService) {}

	async ngOnInit(): Promise<void> {
		this.allUsers = this.service.allUsers;
		console.log(this.allUsers);
	}
}
