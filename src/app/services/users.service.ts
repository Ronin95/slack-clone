import { Injectable, inject } from '@angular/core';
/* import { User } from 'src/models/user.class'; */
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	firestore: Firestore = inject(Firestore);
	constructor() {
		this.getUsers();
	}

	getUsers(): Observable<any[]> {
		const userCollection = collection(this.firestore, 'users');
		const query = getDocs(userCollection);
		return from(query).pipe(
			map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()))
		);
	}
}
