import { Injectable, NgZone } from '@angular/core';
import { User } from '../../models/user.model';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
	AngularFirestore,
	AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { signInAnonymously } from 'firebase/auth';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorLoginComponent } from '../dialog-error-login/dialog-error-login.component';
import { Observable, first } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
@Injectable({
	providedIn: 'root',
})
export class AuthService {
	static authenticateUserGetImg() {
		throw new Error('Method not implemented.');
	}
	userData: any; // Save logged in user data
	errorMsgRegister!: string;
	errorLogin = false;
	uid!: string;
	photoURL!: string;
	userData$!: Observable<any>;
	currentUser$ = authState(this.auth);

	constructor(
		public afs: AngularFirestore, // Inject Firestore service
		public afAuth: AngularFireAuth, // Inject Firebase auth service
		public router: Router,
		public ngZone: NgZone, // NgZone service to remove outside scope warning
		public dialog: MatDialog,
		private auth: Auth
	) {
		this.userData$ = this.afAuth.authState;
		/* Saving user data in localstorage when
    logged in and setting up null when logged out */
		this.afAuth.onAuthStateChanged((user) => {
			if (user) {
				this.afs
					.collection('users')
					.doc(user.uid)
					.get()
					.subscribe(
						(doc) => {
							if (doc && doc.exists) {
								const userData = doc.data() as { [key: string]: any };
								this.userData = { uid: user.uid };
								Object.keys(userData).forEach((key) => {
									this.userData[key] = userData[key];
								});
								console.log('User data:', this.userData);
								localStorage.setItem(
									'loggedInUser',
									JSON.stringify(this.userData.uid)
								); // saving uid from user in localstorage
							} else {
								console.log('User data not found in Firestore');
							}
						},
						(error) => {
							console.log('Error getting user data from Firestore:', error);
						}
					);
			} else {
				console.log('User logged out');
				this.userData = null;
			}
		});
	}

	// Sign in with email/password
	SignIn(email: string, password: string) {
		return this.afAuth
			.signInWithEmailAndPassword(email, password)
			.then((result) => {
				this.SetUserData(result.user);
				this.afAuth.onAuthStateChanged((user) => {
					if (user) {
						this.router.navigate(['home']);
					}
				});
			})
			.catch((error) => {
				if (error) {
					this.errorLogin = true;
					this.loginErrorMsg('500ms', '500ms');
				}
			});
	}

	guestLogin() {
		return this.afAuth
			.signInAnonymously()
			.then((result) => {
				this.SetUserData(result.user);
				this.afAuth.onAuthStateChanged((user) => {
					if (user) {
						this.router.navigate(['home']);
					}
				});
			})
			.catch((error) => {
				window.alert(error.message);
			});
	}

	// Sign up with email/password
	SignUp(email: string, password: string, displayName: string) {
		return this.afAuth
			.createUserWithEmailAndPassword(email, password)
			.then((result) => {
				/* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
				this.SendVerificationMail();
				if (result.user) {
					// set display name of user
					result.user.updateProfile({ displayName: displayName }).then(() => {
						this.SetUserData(result.user);
						this.router.navigate(['/']);
					});
				}
			})
			.catch((error) => {
				if (error) {
					this.errorMsgRegister = 'This email address is already in use';
				} else {
					window.alert(error.message);
				}
			});
	}

	// Send email verfificaiton when new user sign up
	SendVerificationMail() {
		return this.afAuth.currentUser.then((u: any) => u.sendEmailVerification());
	}

	// Reset password
	ForgotPassword(passwordResetEmail: string) {
		return this.afAuth
			.sendPasswordResetEmail(passwordResetEmail)
			.then(() => {
				window.alert('Password reset email sent, check your inbox.');
			})
			.catch((error) => {
				window.alert(error);
			});
	}

	// Returns true when user is looged in and email is verified
	get isLoggedIn(): boolean {
		const user = JSON.parse(localStorage.getItem('user')!);
		return user !== null && user.emailVerified !== false ? true : false;
	}

	// Auth logic to run auth providers
	AuthLogin(provider: any) {
		return this.afAuth
			.signInWithPopup(provider)
			.then((result) => {
				this.router.navigate(['dashboard']);
				this.SetUserData(result.user);
			})
			.catch((error) => {
				window.alert(error);
			});
	}

	/* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
	SetUserData(user: any) {
		const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
		const userData: User = {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			emailVerified: user.emailVerified,
			photoURL: user.photoURL,
		};
		return userRef.set(userData, {
			merge: true,
		});
	}

	// Sign out
	SignOut() {
		return this.afAuth.signOut().then(() => {
			localStorage.removeItem('user');
			this.router.navigate(['']);
		});
	}

	//error msg if email or password is invalid
	loginErrorMsg(enterAnimationDuration: string, exitAnimationDuration: string): void {
		this.dialog.open(DialogErrorLoginComponent, {
			enterAnimationDuration,
			exitAnimationDuration,
		});
	}

	authenticateUserGetImg() {
		this.afAuth.user.subscribe((user) => {
			if (user) {
				const userDoc: AngularFirestoreDocument<any> = this.afs
					.collection('users')
					.doc(user.uid);
				this.userData$ = userDoc.valueChanges();

				this.userData$.subscribe((userData) => {
					if (userData) {
						this.uid = user.uid;
						this.photoURL = userData['photoURL'];
					} else {
						console.log('User data not found in Firestore');
					}
				});
			}
		});
	}
}
