import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from './dialog-new-channel/dialog-new-channel.component';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChannelService } from '../../services/channel.service';
import { ThreadsService } from '../../services/threads.service';

@Component({
	selector: 'app-channels',
	templateUrl: './channels.component.html',
	styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
  @Input()
  channel!: {
    channelId: string;
    channelName: string;
  }[];
	firestore: Firestore = inject(Firestore);
	channels$!: Observable<any>;
	channelId!: any;
	openMenu: boolean = true;

	constructor(
		public dialog: MatDialog,
		public channelService: ChannelService,
    public threadsService: ThreadsService,
	) {}

	ngOnInit() {
		this.channelService.getAllChannels().subscribe((channels: any) => {
      	this.channel = channels;
    });
	}

 /**
  * The `toggleChannels()` method is used to toggle the state of the `openMenu` variable. It changes the value of `openMenu`
  * from `true` to `false` or vice versa.
  * 
  * @method
  * @name toggleChannels
  * @kind method
  * @memberof ChannelsComponent
  * @returns {void}
  */
	toggleChannels() {
		this.openMenu = !this.openMenu;
	}

 /**
  * The `openDialogNewChannel()` method is used to open a dialog box for creating a new channel. It calls the `open()`
  * method of the `MatDialog` class and passes the `DialogNewChannelComponent` as the component to be displayed in the
  * dialog box.
  * 
  * @method
  * @name openDialogNewChannel
  * @kind method
  * @memberof ChannelsComponent
  * @returns {void}
  */
	openDialogNewChannel() {
		this.dialog.open(DialogNewChannelComponent);
	}

 /**
  * The `onDeleteChannel(channelId: any)` method is a function that is called when a channel is being deleted. It takes the
  * `channelId` as a parameter, which represents the ID of the channel to be deleted. Inside the method, it calls the
  * `deleteChannel(channelId)` method of the `ChannelService` to delete the channel with the specified ID.
  * 
  * @method
  * @name onDeleteChannel
  * @kind method
  * @memberof ChannelsComponent
  * @param {any} channelId
  * @returns {void}
  */
	onDeleteChannel(channelId: any) {
		this.channelService.deleteChannel(channelId);
	}

 /**
  * The `saveCurrentSelectedChannel(channelId: any)` method is used to save the ID of the currently selected channel to the
  * local storage. It takes the `channelId` as a parameter, which represents the ID of the channel. Inside the method, it
  * calls the `setItem()` method of the `localStorage` object to store the `channelId` with the key `'selected_channelID'`.
  * This allows the application to remember the selected channel even after a page refresh or when navigating to a different
  * page. Additionally, it calls the `closeThread()` method of the `ThreadsService` to close any open thread related to the
  * previous channel.
  * 
  * @method
  * @name saveCurrentSelectedChannel
  * @kind method
  * @memberof ChannelsComponent
  * @param {any} channelId
  * @returns {void}
  */
	saveCurrentSelectedChannel(channelId: any) {
		// save the current selected channel id to local storage
		localStorage.setItem('selected_channelID', channelId);
    this.threadsService.closeThread();
    this.channelService.isOpenThread = false;
	}
}
