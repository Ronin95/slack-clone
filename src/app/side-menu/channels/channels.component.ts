import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from './dialog-new-channel/dialog-new-channel.component';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';

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

	constructor(public dialog: MatDialog, private channelService: ChannelService) {
	}

	ngOnInit() {
		this.channelService.getAllChannels().subscribe((channels: any) => {
      this.channel = channels;
    });
	}

	toggleChannels() {
		this.openMenu = !this.openMenu;
	}

	openDialogNewChannel() {
		this.dialog.open(DialogNewChannelComponent);
	}

	onDeleteChannel(channelId: any) {
		this.channelService.deleteChannel(channelId);
	}
}
