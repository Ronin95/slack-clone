import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';

@Component({
	selector: 'app-dialog-new-channel',
	templateUrl: './dialog-new-channel.component.html',
	styleUrls: ['./dialog-new-channel.component.scss'],
})
export class DialogNewChannelComponent {
	firestore: Firestore = inject(Firestore);

	channelName: string = '';
	channelChat: object[] = [];

	constructor(public dialogRef: MatDialogRef<DialogNewChannelComponent>) {}

	onNoClick(): void {
		this.dialogRef.close();
	}

	addChannel() {
		const channelCollection = collection(this.firestore, 'channels');
		setDoc(doc(channelCollection), {
			channelName: this.channelName,
			channelChat: this.channelChat,
		}).then(() => {
			// console.log('New channel added:', this.channelName);

		});
    this.dialogRef.close();
	}
}
