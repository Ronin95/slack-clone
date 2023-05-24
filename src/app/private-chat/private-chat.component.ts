import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
	selector: 'app-private-chat',
	templateUrl: './private-chat.component.html',
	styleUrls: ['./private-chat.component.scss'],
})
export class PrivateChatComponent {
	subscribedParam!: any;
	userName: string = '';

	constructor(private route: ActivatedRoute, private firestore: AngularFirestore) {
		this.displayUserName();
	}

	displayUserName() {
		this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.subscribedParam = params.get('id');
					return this.firestore
						.collection('users')
						.doc(this.subscribedParam)
						.valueChanges();
				})
			)
			.subscribe((user: any) => {
				if (user) {
					this.userName = user.displayName;
					console.log(this.userName);
				}
			});
	}
}
