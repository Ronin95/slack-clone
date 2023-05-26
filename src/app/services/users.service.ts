import { Injectable, inject } from '@angular/core';
/* import { User } from 'src/models/user.class'; */
import {
	Firestore,
	collection,
	collectionData,
	getDocs,
	query,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	firestore: Firestore = inject(Firestore);
	constructor() {}

	get getUsers(): Observable<any[]> {
		const userCollection = collection(this.firestore, 'users'); // ´collection to obtain the reference to the collection 'users'
		const queryAll = query(userCollection); // query to obtain all the documents in the collection
		return collectionData(queryAll) as Observable<any[]>; // return the observable with the data
	}
}
