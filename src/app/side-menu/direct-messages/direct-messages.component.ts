import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-direct-messages',
	templateUrl: './direct-messages.component.html',
	styleUrls: ['./direct-messages.component.scss'],
})
export class DirectMessagesComponent implements OnInit {
	users$!: Observable<any[]>;
	openMenu: boolean = true;

	ngOnInit() {}

	constructor(firestore: AngularFirestore) {
		// access the users collection in firestore
		this.users$ = firestore
			.collection('users')
			.snapshotChanges()
			.pipe(
				map((actions) =>
					actions.map((a) => {
						const data = a.payload.doc.data();
						const id = a.payload.doc.id;
						return { id, ...(data as object) };
					})
				)
			);
	}

	toggleDirectMessages() {
		this.openMenu = !this.openMenu;
	}
}
