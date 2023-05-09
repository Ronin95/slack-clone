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
		const userCollection = collection(this.firestore, 'users'); // ´collection to obtain the reference to the collection 'users'
		const query = getDocs(userCollection); // query to obtain the documents of the collection
		return from(query).pipe(
			// from to convert the promise to an observable, pipe to apply the map operator, map to transform the data
			map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()))
		);
	}
}
