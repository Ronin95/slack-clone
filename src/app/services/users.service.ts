import { Injectable, inject } from '@angular/core';
/* import { User } from 'src/models/user.class'; */
import {
	Firestore,
	collection,
	collectionData,
	doc,
	docData,
	getDocs,
	query,
} from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { Auth, UserProfile, authState } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	firestore: Firestore = inject(Firestore);

	currentUser$ = authState(this.auth); // observable with the current user

	constructor(private auth: Auth, private authService: AuthService) {}

	get getUsers(): Observable<any[]> {
		const userCollection = collection(this.firestore, 'users'); // ´collection to obtain the reference to the collection 'users'
		const queryAll = query(userCollection); // query to obtain all the documents in the collection
		return collectionData(queryAll) as Observable<any[]>; // return the observable with the data
	}

	get currentUserProfile$(): Observable<UserProfile | null> {
		return this.authService.currentUser$.pipe(
			switchMap((user) => {
				if (!user?.uid) {
					return of(null);
				}
				const ref = doc(this.firestore, 'users', user.uid);
				return docData(ref) as Observable<UserProfile>;
			})
		);
	}
}
