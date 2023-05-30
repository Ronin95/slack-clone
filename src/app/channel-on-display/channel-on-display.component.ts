import { Component, OnChanges, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap } from 'rxjs';

@Component({
	selector: 'app-channel-on-display',
	templateUrl: './channel-on-display.component.html',
	styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent implements OnInit, OnChanges {
	channelArray: any[] = [];
	channelName: string = '';
	subscribedParam!: any;
	messageText!: string;
	messages!: Observable<any[]>;
	data = '';

	constructor(
		public channelService: ChannelService,
		private route: ActivatedRoute,
		private firestore: AngularFirestore,
		private router: Router
	) {}

	ngOnChanges() {
		console.log('Test - 2');
	}

	logData(data: string) {
		this.data = data;
		console.log(this.data);
	}

	async sendMessage(): Promise<void> {
		if (this.messageText) {
			await this.channelService.saveMessageToFirebase(this.messageText);
			this.messageText = '';
		}
	}

	async ngOnInit() {
		this.displayChannelName();
		this.messages = await this.channelService.fetchMessagesFromFirebase();
		console.log('Test - 1');

		this.router.events.subscribe(async (event) => {
			console.log(event);
			if (event instanceof NavigationEnd) {
				this.displayChannelName();
				// debugger;
				this.messages = await this.channelService.fetchMessagesFromFirebase();
			}
		});
	}

	displayChannelName() {
		this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.subscribedParam = params.get('id');
					return this.firestore
						.collection('channels')
						.doc(this.subscribedParam)
						.valueChanges();
				})
			)
			.subscribe((channel: any) => {
				if (channel) {
					this.channelName = channel.channelName; // Annahme: Das Feld mit dem Namen ist 'channelName'
					console.log(this.channelName);
				}
			});
	}

	// sendMessage() {
	//   this.route.paramMap
	//     .pipe(
	//       switchMap((params) => {
	//         this.subscribedParam = params.get('id');
	//         return this.firestore
	//           .collection('channels')
	//           .doc(this.subscribedParam)
	//           .valueChanges()
	//           .pipe(take(1));
	//       })
	//     )
	//     .subscribe((channel: any) => {
	//       const message = {
	//         text: this.messageText, // Use "messageText" instead of "this.control.value"
	//         timestamp: new Date(),
	//       };
	//       const channelRef: AngularFirestoreDocument<any> = this.firestore
	//         .collection('channels')
	//         .doc(this.subscribedParam);
	//       channelRef
	//         .update({
	//           channelChat: [...channel.channelChat, message],
	//         })
	//         .then(() => {
	//           console.log('Message sent and saved.');
	//         })
	//         .catch((error) => {
	//           console.error('Error saving the message:', error);
	//         });
	//     });
	// }
}
