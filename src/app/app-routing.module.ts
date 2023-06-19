import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ThreadsComponent } from './threads/threads.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { ChatgptComponent } from './slack-apps/chatgpt/chatgpt.component';
import { ChannelOnDisplayComponent } from './channel-on-display/channel-on-display.component';
import {
	canActivate,
	redirectUnauthorizedTo,
	redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { WeatherComponent } from './slack-apps/weather/weather.component';

const redirectToLogin = () => redirectUnauthorizedTo(['']);
const redirectToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
	{ path: 'chat/:id', component: PrivateChatComponent },
	{ path: 'headerMenu', component: HeaderComponent },
	{ path: 'home', component: HomeComponent, ...canActivate(redirectToLogin) },
	// { path: 'home/threads', component: ThreadsComponent },
	{ path: 'home/chatgpt', component: ChatgptComponent },
  { path: 'home/weather', component: WeatherComponent},
	{ path: 'home/sendMessage', component: SendMessageComponent },
	{ path: '', component: WelcomeScreenComponent, ...canActivate(redirectToHome) },
	{ path: 'sideMenu', component: SideMenuComponent },
	{ path: 'channel/:id', component: ChannelOnDisplayComponent,
		children: [
			{ path: 'thread/:id', component: ThreadsComponent }
		] },
	// { path: 'thread/:id', component: ThreadsComponent },
	{ path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
