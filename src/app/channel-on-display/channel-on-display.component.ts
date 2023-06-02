import { Component, OnChanges, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap } from 'rxjs';

@Component({
	selector: 'app-channel-on-display',
	templateUrl: './channel-on-display.component.html',
	styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent implements OnInit, OnChanges {
	channelArray: any[] = [];
  channelId: string | null = null;
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

	async sendMessage(): Promise<void> {
		if (this.messageText) {
			await this.channelService.saveMessageToFirebase(this.messageText);
			this.messageText = '';
		}
	}

	async onDeleteSelectedMessage(messageId: string) {
    	await this.channelService.deleteMessageFromFirebase(messageId);
  	}

	async ngOnInit() {
		let { channelName, channelId } = await this.displayChannelNameAndID();
		this.messages = await this.channelService.fetchMessagesFromFirebase(channelId);
		this.router.events.subscribe(async (event) => {
			if (event instanceof NavigationEnd) {
				let { channelName, channelId } = await this.displayChannelNameAndID();
        		this.messages = await this.channelService.fetchMessagesFromFirebase(channelId);
			}
		});
	}

	displayChannelNameAndID(): Promise<{ channelName: string, channelId: string }> {
    return new Promise((resolve) => {
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
            const { channelName, channelId } = channel;
            this.channelId = channelId;
            this.channelName = channelName;
            console.log(this.channelName, this.channelId);
            resolve({ channelName, channelId });
          }
        });
    });
  }

}
