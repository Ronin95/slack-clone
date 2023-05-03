import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
  { path: 'headerMenu', component: HeaderComponent},
  { path: 'welcomeScreen', component: WelcomeScreenComponent },
  { path: 'sideMenu', component: SideMenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
