import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore, addDoc, collection, updateDoc } from '@angular/fire/firestore';

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

 /**
  * The `onNoClick()` method is a function that is called when the user clicks on the "No" button in the dialog. It is
  * responsible for closing the dialog by calling the `close()` method of the `MatDialogRef` object.
  * 
  * @method
  * @name onNoClick
  * @kind method
  * @memberof DialogNewChannelComponent
  * @returns {void}
  */
	onNoClick(): void {
		this.dialogRef.close();
	}

 /**
  * The `async addChannel()` method is responsible for adding a new channel to the Firestore database.
  * 
  * @async
  * @method
  * @name addChannel
  * @kind method
  * @memberof DialogNewChannelComponent
  * @returns {Promise<void>}
  */
	async addChannel() {
    const channelCollection = collection(this.firestore, 'channels');

    try {
      // Add a new document and get a DocumentReference
      const docRef = await addDoc(channelCollection, {
        channelName: this.channelName,
        // The ID is not known at the time the document is created, so it can't be included here
      });

      // The ID is now known, so you can update the document to include it
      await updateDoc(docRef, {
        channelId: docRef.id,
      });

      // console.log('New channel added:', this.channelName);

      this.dialogRef.close();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
}
