import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dialog-user-info',
  templateUrl: './dialog-user-info.component.html',
  styleUrls: ['./dialog-user-info.component.scss'],
})
export class DialogUserInfoComponent implements OnInit{
  public file: any = [];
  uploadProgress!: number;
  onDisplay = true;
  uid!: string;
  selectedStatus: string = 'Online';
  dropdownOpen: boolean = false;

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<DialogUserInfoComponent>,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
  ) { }

  /**
   * The `ngOnInit()` method is a lifecycle hook in Angular that is called after the component has been initialized. In this
   * code, the `ngOnInit()` method is used to perform some initialization tasks when the component is created.
   * 
   * @method
   * @name ngOnInit
   * @kind method
   * @memberof DialogUserInfoComponent
   * @returns {void}
   */
  ngOnInit() {
    if (this.authService.userData) {
      this.uid = this.authService.userData.uid;
    }
    this.getOnlineStatus();
  }

  /**
   * The `getOnlineStatus()` method is retrieving the online status of the user from the Firestore database. It subscribes to
   * the `valueChanges()` method of the Firestore document `users/${this.uid}` and updates the `selectedStatus` property with
   * the retrieved status value.
   * 
   * @method
   * @name getOnlineStatus
   * @kind method
   * @memberof DialogUserInfoComponent
   * @returns {void}
   */
  getOnlineStatus() {
    this.firestore
      .doc(`users/${this.uid}`)
      .valueChanges()
      .subscribe((user: any) => {
        if (user && user.status) {
          this.selectedStatus = user.status;
        }
      });
  }

  /**
   * The `toggleDropdown()` method is used to toggle the state of the `dropdownOpen` property. When called, it will invert
   * the value of `dropdownOpen`, which means if `dropdownOpen` is `true`, it will become `false`, and if `dropdownOpen` is
   * `false`, it will become `true`. This method is typically used to show or hide a dropdown menu in the user interface.
   * 
   * @method
   * @name toggleDropdown
   * @kind method
   * @memberof DialogUserInfoComponent
   * @returns {void}
   */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * The `selectStatus(status: string)` method is used to update the selected status of the user in the Firestore database.
   * It takes a `status` parameter of type string, which represents the selected status value.
   * 
   * @method
   * @name selectStatus
   * @kind method
   * @memberof DialogUserInfoComponent
   * @param {string} status
   * @returns {void}
   */
  selectStatus(status: string) {
    this.selectedStatus = status;
    this.dropdownOpen = true;
    this.firestore.doc(`users/${this.uid}`).update({ status });
  }


  /**
   * The `uploadFile(event: Event, uid: string)` method is responsible for uploading a file (image) to the Firebase storage
   * and updating the user's photoURL in the Firestore database.
   * 
   * @method
   * @name uploadFile
   * @kind method
   * @memberof DialogUserInfoComponent
   * @param {Event} event
   * @param {string} uid
   * @returns {void}
   */
  uploadFile(event: Event, uid: string) {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;

    if (file) {
      const filePath = `profileImages/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // get notified when the download URL is available
      task
        .snapshotChanges()
        .pipe(
          finalize(() =>
            fileRef.getDownloadURL().subscribe((url) => {
              // Update the user's photoURL in Firestore
              this.firestore
                .collection('users')
                .doc(uid)
                .update({
                  photoURL: url,
                });
            })
          )
        )
        .subscribe();
    }

    // Delete capability to upload a new image
    this.onDisplay = false;

  }
}
