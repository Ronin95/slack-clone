import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-dialog-new-channel',
	templateUrl: './dialog-new-channel.component.html',
	styleUrls: ['./dialog-new-channel.component.scss'],
})
export class DialogNewChannelComponent {
	constructor(
    public dialogRef: MatDialogRef<DialogNewChannelComponent>,
    private http: HttpClient)
    {}

	onNoClick() {
		this.dialogRef.close();
	}

	addChannel(postData: { channelName: string }) {
    this.http
    .post(
      'https://slack-clone-da-default-rtdb.europe-west1.firebasedatabase.app/channels.json', // replace this link with yours from realtime database
      postData)
    .subscribe(responseData => {
      console.log(responseData);
    });
    this.dialogRef.close();
	}
}
