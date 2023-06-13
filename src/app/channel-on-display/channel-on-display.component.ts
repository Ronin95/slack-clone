import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, Subscription } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';
import { SafeHtml } from '@angular/platform-browser';
import { ThreadsService } from '../services/threads.service';

@Component({
	selector: 'app-channel-on-display',
	templateUrl: './channel-on-display.component.html',
	styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent implements OnInit, OnDestroy {
	imageInsertedSubscription!: Subscription;
	showThreadContainer = false;
	private closeSub!: Subscription;
	channelArray: any[] = [];
	channelName: string = '';
	subscribedParam!: any;
	messageText: string = '';
	messages!: Observable<any[]>;
	messages$!: Observable<any[]>;
	data = '';
	editor!: Editor;
	toolbar: Toolbar = [['bold', 'italic', 'underline', 'strike', 'code', 'blockquote']];
	channelId: string = '';
	sanitizer: any;

	constructor(
		private threadsService: ThreadsService,
		public channelService: ChannelService,
		private route: ActivatedRoute,
		private firestore: AngularFirestore,
		private router: Router
	) {}

	sanitizeHtmlWithImageSize(html: string): SafeHtml {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = html;

		const images = wrapper.querySelectorAll('img');

		images.forEach((image: HTMLImageElement) => {
			image.style.maxHeight = '200px';
		});
		const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(wrapper.innerHTML);
		return sanitizedHtml;
	}

	sendMessage() {
		this.channelService.saveMessageToFirebase(this.messageText);
		this.messageText = '';
	}

	async onDeleteSelectedMessage(messageId: string) {
		await this.channelService.deleteMessageFromFirebase(messageId);
	}

	// make sure to destory the editor
	ngOnDestroy(): void {
		this.editor.destroy();
		this.imageInsertedSubscription.unsubscribe();
		this.closeSub.unsubscribe();
	}

	async ngOnInit() {
		this.editor = new Editor();
		let { channelName, channelId } = await this.displayChannelNameAndID();
		this.displayChannelName();
		this.messages = this.channelService.fetchMessagesFromFirebase(channelId);
		this.imageInsertedSubscription =
			this.channelService.imageInsertedSubject.subscribe((url) => {
				this.insertImageToEditor(url);
			});

		this.router.events.subscribe(async (event) => {
			if (event instanceof NavigationEnd) {
				let { channelName, channelId } = await this.displayChannelNameAndID();
				this.messages = this.channelService.fetchMessagesFromFirebase(channelId);
				this.channelService.sendChannelID(channelId);
			}
		});

		this.closeSub = this.threadsService.close$.subscribe(() => {
			this.showThreadContainer = false;
		});
	}

	insertImageToEditor(url: string) {
		this.messageText += `<img src="${url}" alt="Uploaded Image">`;
	}

	onChatIconClick() {
		this.showThreadContainer = true;
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

	displayChannelNameAndID(): Promise<{
		channelName: string;
		channelId: string;
	}> {
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
						// console.log(this.channelName, this.channelId);
						resolve({ channelName, channelId });
					}
				});
		});
	}
}
