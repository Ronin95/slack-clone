import { Injectable, NgZone } from '@angular/core';
import { User } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorLoginComponent } from '../dialog-error-login/dialog-error-login.component';
import { Observable } from 'rxjs';
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
    /* Saving user data in localstorage when logged in and setting up null when logged out */
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
                console.log('1) User data not found in Firestore');
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

  /**
   * The `SignIn(email: string, password: string)` method is used to sign in a user with their email and password. It uses
   * the `signInWithEmailAndPassword` method from `AngularFireAuth` to authenticate the user. If the sign-in is successful,
   * it calls the `SetUserData` method to save the user data and navigates to the home page. If there is an error during
   * sign-in, it sets the `errorLogin` flag to true and displays an error message using the `loginErrorMsg` method.
   *
   * @method
   * @name SignIn
   * @kind method
   * @memberof AuthService
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  async SignIn(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      await this.SetUserData(result.user); // Warte auf die Speicherung der Benutzerdaten
      this.router.navigate(['home']);
    } catch (error) {
      this.errorLogin = true;
      this.loginErrorMsg('500ms', '500ms');
    }
  }

  /**
   * The `guestLogin()` method is used to sign in a user as a guest. It calls the `signInAnonymously()` method from
   * `AngularFireAuth` to authenticate the user. If the sign-in is successful, it calls the `SetUserData` method to save the
   * user data and navigates to the home page. If there is an error during sign-in, it displays an error message using
   * `window.alert()`.
   *
   * @method
   * @name guestLogin
   * @kind method
   * @memberof AuthService
   * @returns {Promise<void>}
   */
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

  /**
   * The `SignUp` method is used to create a new user account with the provided email, password, and display name. It uses
   * the `createUserWithEmailAndPassword` method from `AngularFireAuth` to create the user account. If the account creation
   * is successful, it calls the `SendVerificationMail` method to send a verification email to the user. It also sets the
   * display name of the user and saves the user data using the `SetUserData` method. Finally, it navigates to the home page.
   * If there is an error during the account creation, it sets the `errorMsgRegister` variable to display an error message.
   *
   * @method
   * @name SignUp
   * @kind method
   * @memberof AuthService
   * @param {string} email
   * @param {string} password
   * @param {string} displayName
   * @returns {Promise<void>}
   */
  async SignUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.SendVerificationMail();
      if (result.user) {
        await result.user.updateProfile({ displayName: displayName });
        await this.SetUserData(result.user); // Warte auf die Speicherung der Benutzerdaten
        this.router.navigate(['/home']);
      }
    } catch (error) {
      this.errorMsgRegister = 'This email address is already in use';
    }
  }

  /**
   * The `SendVerificationMail()` method is used to send a verification email to the user after they have signed up for a new
   * account. It calls the `sendEmailVerification()` method from `AngularFireAuth` to send the email.
   *
   * @method
   * @name SendVerificationMail
   * @kind method
   * @memberof AuthService
   * @returns {Promise<any>}
   */
  SendVerificationMail() {
    return this.afAuth.currentUser.then((u: any) => u.sendEmailVerification());
  }

  /**
   * The `ForgotPassword(passwordResetEmail: string)` method is used to send a password reset email to the user. It takes the
   * user's email address as a parameter and calls the `sendPasswordResetEmail()` method from `AngularFireAuth` to send the
   * email. If the email is sent successfully, it displays a success message. If there is an error, it displays the error
   * message using `window.alert()`.
   *
   * @method
   * @name ForgotPassword
   * @kind method
   * @memberof AuthService
   * @param {string} passwordResetEmail
   * @returns {Promise<void>}
   */
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

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  async SetUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    };
    try {
      await userRef.set(userData, { merge: true });
      // Speichere die userData im AuthService-Objekt
      this.userData = userData;
      console.log('User data:', this.userData);
      localStorage.setItem('loggedInUser', JSON.stringify(this.userData.uid));
    } catch (error) {
      console.log('Error setting user data:', error);
    }
  }

  /**
   * The `SignOut()` method is used to sign out the currently logged-in user. It calls the `signOut()` method from
   * `AngularFireAuth` to sign out the user. After signing out, it removes the user data from the local storage and navigates
   * to the home page.
   *
   * @method
   * @name SignOut
   * @kind method
   * @memberof AuthService
   * @returns {Promise<void>}
   */
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['']);
    });
  }

  /**
   * The `loginErrorMsg` method is used to display an error message dialog when there is an error during the sign-in process.
   * It takes two parameters: `enterAnimationDuration` and `exitAnimationDuration`, both of type string. These parameters are
   * used to control the animation duration when the error message dialog enters and exits the screen. The method opens a
   * dialog using the `MatDialog` service and passes the animation durations as options.
   *
   * @method
   * @name loginErrorMsg
   * @kind method
   * @memberof AuthService
   * @param {string} enterAnimationDuration
   * @param {string} exitAnimationDuration
   * @returns {void}
   */
  loginErrorMsg(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DialogErrorLoginComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  /**
   * The `authenticateUserGetImg()` method is used to authenticate the user and retrieve their profile image. It subscribes
   * to the `user` observable from `afAuth` (AngularFireAuth) and retrieves the user's data from Firestore using the `uid`
   * obtained from the user object. It then sets the `uid` and `photoURL` properties of the AuthService class based on the
   * retrieved data.
   *
   * @method
   * @name authenticateUserGetImg
   * @kind method
   * @memberof AuthService
   * @returns {void}
   */
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
            console.log('2) User data not found in Firestore');
          }
        });
      }
    });
  }
}
