import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from './dialog-new-channel/dialog-new-channel.component';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openMenu: boolean = false;

  toggleChannels() {
    this.openMenu = !this.openMenu;
  }

  openDialogNewChannel() {
    this.dialog.open(DialogNewChannelComponent)
  }
}
