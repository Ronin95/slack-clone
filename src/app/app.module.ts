// Angular Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';

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

// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { WorkspaceColumnComponent } from './side-menu/workspace-column/workspace-column.component';
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
import { DialogDeleteMessageComponent } from './dialog-delete-message/dialog-delete-message.component';
import { MessageBoxComponent } from './message-box/message-box.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeScreenComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    SideMenuComponent,
    WorkspaceColumnComponent,
    ChannelColumnComponent,
    HomeComponent,
    ThreadsComponent,
    UsersComponent,
    SendMessageComponent,
    ChannelsComponent,
    DirectMessagesComponent,
    DialogDeleteMessageComponent,
    MessageBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
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
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
