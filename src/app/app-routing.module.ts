import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ThreadsComponent } from './threads/threads.component';
import { UsersComponent } from './users/users.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { ChatgptComponent } from './slack-apps/chatgpt/chatgpt.component';

const routes: Routes = [
	{ path: 'headerMenu', component: HeaderComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'home/threads', component: ThreadsComponent },
	{ path: 'home/users', component: UsersComponent },
  { path: 'home/chatgpt', component: ChatgptComponent},
	{ path: 'home/sendMessage', component: SendMessageComponent },

	{ path: '', component: WelcomeScreenComponent },
	{ path: 'sideMenu', component: SideMenuComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
