import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from './dialog-new-channel/dialog-new-channel.component';
import {
	Firestore,
	collection,
	collectionData,
	deleteDoc,
	doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
	selector: 'app-channels',
	templateUrl: './channels.component.html',
	styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
	firestore: Firestore = inject(Firestore);
	channels$!: Observable<any>;
	channel!: Array<any>;
	channelId!: any;
	openMenu: boolean = false;

	constructor(public dialog: MatDialog, private channelService: ChannelService) {
		/* 	this.channelService.getAllChannels(); */
	}

	ngOnInit() {
		this.channelService.getAllChannels();
	}

	toggleChannels() {
		this.openMenu = !this.openMenu;
	}

	openDialogNewChannel() {
		this.dialog.open(DialogNewChannelComponent);
	}

	/* 	getAllChannels() {
		const channelColl = collection(this.firestore, 'channels');
		this.channels$ = collectionData(channelColl, { idField: 'channelId' });
		this.channels$.subscribe((changes: any) => {
			this.channel = changes;
			console.log(this.channel);
		});
	} */

	onDeleteChannel(channelId: any) {
		this.channelService.deleteChannel(this.channelId);
	}
}
