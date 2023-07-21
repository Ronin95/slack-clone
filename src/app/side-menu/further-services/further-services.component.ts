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

  /**
   * The `toggleChannels()` method is a function that toggles the value of the `openMenu` property. It sets the value of
   * `openMenu` to the opposite of its current value. If `openMenu` is `true`, it will be set to `false`, and if `openMenu`
   * is `false`, it will be set to `true`.
   * 
   * @method
   * @name toggleChannels
   * @kind method
   * @memberof FurtherServicesComponent
   * @returns {void}
   */
  toggleChannels() {
    this.openMenu = !this.openMenu;
  }

}
