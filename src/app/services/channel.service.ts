import { Injectable, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
	Firestore,
	collection,
	collectionData,
	deleteDoc,
	doc,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import {
	Observable,
	Subscription,
	finalize,
	switchMap,
	take,
	firstValueFrom,
	map,
} from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { getDocs, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { FormControl } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
	Storage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from '@angular/fire/storage';
import * as firebase from 'firebase/compat';

@Injectable({
	providedIn: 'root',
})
export class ChannelService implements OnInit {
	db: any = getFirestore();
	firestore: Firestore = inject(Firestore);
	channels!: any;
	channel!: Array<any>;
	name!: string;
	uid!: string;
	photoURL!: string;
	userData!: Subscription;
	foundUser!: any; // in getUserNameAndImgFromFirebase()
	uploadedImgURL: string = '';

	constructor(
		private afs: AngularFirestore,
		private storage: AngularFireStorage,
		private router: Router
	) {}

	ngOnInit() {
		// this.router.events.subscribe((event) => {
		//   console.log(event);
		// })
	}

	getAllChannels(): Observable<any> {
		// Return type is now Observable<any>
		const channelColl = collection(this.firestore, 'channels');
		this.channels = collectionData(channelColl, { idField: 'channelId' });
		this.channels.subscribe((changes: any) => {
			this.channel = changes;
			// console.log(this.channel);
		});
		return this.channels; // Return the Observable
	}

	deleteChannel(channelId: any) {
		const channelColl = collection(this.firestore, 'channels');
		const docRef = doc(channelColl, channelId);
		deleteDoc(docRef);
	}

	async onFileChange(event: any) {
		const file = event.target.files[0];
		const documentId = await this.getDocumentId('channels');
		const filePath = `/channelImages/${documentId}/${file.name}`;
		const fileRef = this.storage.ref(filePath);
		const task = this.storage.upload(filePath, file);

		// observe percentage changes
		task.percentageChanges().subscribe((percentage) => {
			console.log(percentage);
		});

		// get notified when the download URL is available
		task.snapshotChanges()
			.pipe(
				finalize(() => {
					fileRef.getDownloadURL().subscribe((downloadURL) => {
						console.log('File available at', downloadURL);
						this.uploadedImgURL = downloadURL; // Store the download URL
					});
				})
			)
			.subscribe();
	}

	onButtonClick() {
		const fileInput = document.getElementById('fileInput');
		if (fileInput) {
			fileInput.click();
		} else {
			console.error('Could not find element with ID "fileInput"');
		}
	}

	async getDocumentId(collection: string): Promise<string> {
		const snapshot$ = this.afs.collection(collection).snapshotChanges().pipe(take(1));
		const snapshot = await firstValueFrom(snapshot$);
		if (!snapshot || snapshot.length === 0) {
			throw new Error(`No documents found in collection: ${collection}`);
		}
		const documentId = snapshot[0].payload.doc.id;
		return documentId;
	}

	getFormattedDate(date: Date): string {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		const dayName = days[date.getDay()];
		const day = String(date.getDate()).padStart(2, '0');
		const month = months[date.getMonth()];
		const year = String(date.getFullYear()).slice(-2);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const formattedDate = `${dayName}, ${day}. ${month} ${year} | ${hours}:${minutes}`;
		return formattedDate;
	}

	async getUserNameAndImgFromFirebase() {
		const userData = collection(this.db, 'users');
		const docsSnap = await getDocs(userData);
		const getUIDFromLocalStorage = localStorage.getItem('loggedInUser');
		const getArrayForm = docsSnap.docs.map((doc) => doc.data());
		for (let i = 0; i < getArrayForm.length; i++) {
			if (getArrayForm[i]['uid'] === getUIDFromLocalStorage?.slice(1, -1)) {
				this.foundUser = getArrayForm[i];
				break;
			}
		}
		if (this.foundUser !== null) {
			this.name = this.foundUser['displayName'];
			this.photoURL = this.foundUser['photoURL'];
		}
	}

	async saveMessageToFirebase(message: string): Promise<void> {
		// Call the function to get the username and photoURL
		await this.getUserNameAndImgFromFirebase();
		// Now this.name and this.photoURL should have the username and photoURL
		const documentId = await this.getDocumentId('channels');
		const channelChatRef = this.afs
			.collection('channels')
			.doc(documentId)
			.collection('ChannelChat');
		const date = new Date();
		const formattedDate = this.getFormattedDate(date);
		// Add the message, the formatted date, username, photoURL, and uploadedImgURL to the collection
		channelChatRef.add({
			message: message,
			date: formattedDate,
			userName: this.name, // Adding username to the document
			userPhotoURL: this.photoURL, // Adding photoURL to the document
			uploadedImgURL: this.uploadedImgURL, // Adding uploaded image URL to the document
		});

		// Reset the uploadedImgURL for the next upload
		this.uploadedImgURL = '';
	}

	async fetchMessagesFromFirebase(): Promise<Observable<any[]>> {
		const documentId = await this.getDocumentId('channels');
		// Replace 'channels' and 'ChannelChat' with the actual path to your Firestore collection
		return this.afs
			.collection('channels')
			.doc(documentId)
			.collection('ChannelChat', (ref) => ref.orderBy('date')) // Add the sorting condition here
			.snapshotChanges()
			.pipe(
				map((actions) =>
					actions.map((a) => {
						const data = a.payload.doc.data();
						const id = a.payload.doc.id;
						console.log(data);
						return { id, ...data };
					})
				)
			);
	}

	// this function deletes the message from the firestore database
	async deleteMessageFromFirebase(messageId: string): Promise<void> {
		// const documentId = await this.getDocumentId('channels');
		// const channelChatRef = this.afs.collection('channels').doc(documentId).collection('ChannelChat');
		// const docRef = doc(channelChatRef, messageId);
		// deleteDoc(docRef);
	}
}
