import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from './dialog-new-channel/dialog-new-channel.component';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Channel } from '../../../models/channels.model';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-channels',
	templateUrl: './channels.component.html',
	styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
  loadedChannels: Channel[] = [];
	channel!: Array<any>;
  openMenu: boolean = false;

	constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient) {}

	ngOnInit() {
		this.getAllChannels();
	}

	toggleChannels() {
		this.openMenu = !this.openMenu;
	}

	openDialogNewChannel() {
		this.dialog.open(DialogNewChannelComponent);
	}

	openChannel() {
    // the 'zNE6IVa1wqp4I76WgdSr' has to be replaced with the id of the channel
    // this.router.navigateByUrl('channel/' + 'zNE6IVa1wqp4I76WgdSr');
    console.log('Open');
	}

  getAllChannels() {
    this.http
    .get(
      environment.firebase.databaseURL + '/channels.json')
    .pipe(map((responseData: Record<string, any>) => {
      const channelsArray: Channel[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          channelsArray.push({ ...responseData[key], id: key });
        }
      }
      return channelsArray;
    }))
    .subscribe(channels => {
      console.log(channels);
      this.loadedChannels = channels;
    });
  }

  deleteChannel(id: string) {
    this.http
    .delete(
      environment.firebase.databaseURL + '/channels/' + id + '.json')
    .subscribe(() => {
      this.getAllChannels();
    });
  }
}
