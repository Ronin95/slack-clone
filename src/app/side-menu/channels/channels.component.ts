import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from './dialog-new-channel/dialog-new-channel.component';
import { Firestore, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
	selector: 'app-channels',
	templateUrl: './channels.component.html',
	styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
	firestore: Firestore = inject(Firestore);
	channels$!: Observable<any>;
	channel!: Array<any>;

	constructor(public dialog: MatDialog, private router: Router) {}

	ngOnInit(): void {
		const channelColl = collection(this.firestore, 'channels');
		this.channels$ = collectionData(channelColl);
		this.channels$.subscribe((changes: any) => {
			this.channel = changes;
		});
	}

	openMenu: boolean = false;

	toggleChannels() {
		this.openMenu = !this.openMenu;
	}

	openDialogNewChannel() {
		this.dialog.open(DialogNewChannelComponent);
	}

	openChannel() {
		this.router.navigateByUrl('channel/' + 'zNE6IVa1wqp4I76WgdSr');
	}
}
