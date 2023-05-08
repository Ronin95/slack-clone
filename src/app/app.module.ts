import { environment } from 'src/environments/environment.prod';

// Services
import { OpenAiService } from './services/open-ai.service';

/* FireBase */
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { getAuth, provideAuth } from '@angular/fire/auth';

// Material Design
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';

// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ChannelColumnComponent } from './side-menu/channel-column/channel-column.component';
import { HomeComponent } from './home/home.component';
import { ThreadsComponent } from './threads/threads.component';
import { UsersComponent } from './users/users.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelsComponent } from './side-menu/channel-column/channels/channels.component';
import { DirectMessagesComponent } from './side-menu/channel-column/direct-messages/direct-messages.component';
import { DialogNewChannelComponent } from './side-menu/channel-column/channels/dialog-new-channel/dialog-new-channel.component';
import { FurtherServicesComponent } from './side-menu/channel-column/further-services/further-services.component';
import { AuthService } from './services/auth.service';
import { ChatgptComponent } from './slack-apps/chatgpt/chatgpt.component';
import { DialogUserInfoComponent } from './header/dialog-user-info/dialog-user-info.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

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
    VerifyEmailComponent
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
