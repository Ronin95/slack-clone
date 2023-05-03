import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu.component';

const routes: Routes = [{ path: 'sideMenu', component: SideMenuComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
