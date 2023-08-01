export interface User {
    photoURL: string;
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean; 
}

export interface GuestCounterData {
    count?: number;
  }