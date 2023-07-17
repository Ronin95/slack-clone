import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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

  constructor(private breakpointObserver: BreakpointObserver, private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.breakpointObserver.observe([Breakpoints.Handset])
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

  closeDrawer() {
    if (window.innerWidth < 600) {
      this.drawer.close();
    }
  }
  
}
