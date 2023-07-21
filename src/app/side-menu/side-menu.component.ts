import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  @ViewChild('drawer')
  drawer!: MatDrawer;

  constructor(private breakpointObserver: BreakpointObserver) {}

  /**
   * The `ngAfterViewInit()` method is a lifecycle hook in Angular that is called after the component's view has been
   * initialized. In this code, it is used to observe the screen width using the `BreakpointObserver` from Angular CDK.
   * 
   * @method
   * @name ngAfterViewInit
   * @kind method
   * @memberof SideMenuComponent
   * @returns {void}
   */
  ngAfterViewInit() {
        this.breakpointObserver.observe([`(max-width: 600px)`])
      .subscribe((result) => {
        setTimeout(() => {
          if (result.matches) {
            this.drawer.mode = 'over';
            this.drawer.close();
          } else {
            this.drawer.mode = 'side';
            this.drawer.open();
          }
        });
      });
  }

  /**
   * The `closeDrawer()` method is a function that is called when the user wants to close the side menu drawer. It checks the
   * width of the window and if it is less than 600 pixels, it closes the drawer by calling the `close()` method on the
   * `MatDrawer` instance. This is done to ensure that on smaller screens, the drawer is closed automatically after a menu
   * item is selected.
   * 
   * @method
   * @name closeDrawer
   * @kind method
   * @memberof SideMenuComponent
   * @returns {void}
   */
  closeDrawer() {
    if (window.innerWidth < 600) {
      this.drawer.close();
    }
  }

}
