import { Injectable, inject } from '@angular/core';
/* import { User } from 'src/models/user.class'; */
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	firestore: Firestore = inject(Firestore);
	constructor() {
		this.getUsers();
	}

	allUsers: any[] = [];

	async getUsers() {
		const querySnapshot = await getDocs(collection(this.firestore, 'users'));
		querySnapshot.forEach((doc) => {
			this.allUsers.push(doc.data());
		});
	}
}
