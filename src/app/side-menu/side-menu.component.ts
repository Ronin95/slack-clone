import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  @ViewChild('drawer')
  drawer!: MatDrawer;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngAfterViewInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        if (result.matches) {
          this.drawer.mode = 'over';
          this.drawer.close();
        } else {
          this.drawer.mode = 'side';
          this.drawer.open();
        }
      });
  }
}
