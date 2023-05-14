import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
      environment.firebase.databaseURL + '/channels.json',
      postData)
    .subscribe(responseData => {
      console.log(responseData);
    });
    this.dialogRef.close();
	}
}
