import { environment } from 'src/environments/environment.prod';

// Services
import { OpenAiService } from './services/open-ai.service';

/* FireBase */
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Material Design
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

// Components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DialogUserInfoComponent } from './header/dialog-user-info/dialog-user-info.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { AuthService } from './services/auth.service';
import { ChannelColumnComponent } from './side-menu/channel-column/channel-column.component';
import { ChannelsComponent } from './side-menu/channel-column/channels/channels.component';
import { DialogNewChannelComponent } from './side-menu/channel-column/channels/dialog-new-channel/dialog-new-channel.component';
import { DirectMessagesComponent } from './side-menu/channel-column/direct-messages/direct-messages.component';
import { FurtherServicesComponent } from './side-menu/channel-column/further-services/further-services.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ThreadsComponent } from './threads/threads.component';
import { UsersComponent } from './users/users.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { ChatgptComponent } from './slack-apps/chatgpt/chatgpt.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChannelOnDisplayComponent } from './channel-on-display/channel-on-display.component';

@NgModule({
	declarations: [
		AppComponent,
		WelcomeScreenComponent,
		LoginComponent,
		RegisterComponent,
		HeaderComponent,
		SideMenuComponent,
		ChannelColumnComponent,
		HomeComponent,
		ThreadsComponent,
		UsersComponent,
		SendMessageComponent,
		ChannelsComponent,
		DirectMessagesComponent,
		DialogNewChannelComponent,
		FurtherServicesComponent,
		ChatgptComponent,
		DialogUserInfoComponent,
		ForgotPasswordComponent,
		VerifyEmailComponent,
  ChannelOnDisplayComponent,
	],
	imports: [
		CommonModule,
		BrowserModule,
		AppRoutingModule,
		/* 	AngularFireModule.initializeApp(environment.firebase), */
		// provideFirebaseApp(() => initializeApp(environment.firebase)),
		// provideAuth(() => getAuth()),
		// provideDatabase(() => getDatabase()),
		// provideFirestore(() => getFirestore()),
		BrowserAnimationsModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		MatCardModule,
		MatMenuModule,
		FormsModule,
		ReactiveFormsModule,
		MatListModule,
		MatDividerModule,
		MatSelectModule,
		MatAutocompleteModule,
		MatExpansionModule,
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		AngularFireModule.initializeApp(environment.firebase),
		provideFirestore(() => getFirestore()),
		provideAuth(() => getAuth()),
		AngularFireDatabaseModule,
		AngularFirestoreModule,
		AngularFireStorageModule,
	],
	providers: [AuthService, OpenAiService],
	bootstrap: [AppComponent],
})
export class AppModule {}
