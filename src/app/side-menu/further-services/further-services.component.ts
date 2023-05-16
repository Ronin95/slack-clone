import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-further-services',
  templateUrl: './further-services.component.html',
  styleUrls: ['./further-services.component.scss']
})
export class FurtherServicesComponent implements OnInit {
  openMenu: boolean = true;

  constructor() { }

  ngOnInit() {}

  toggleChannels() {
    this.openMenu = !this.openMenu;
  }

}
