import { Timestamp } from 'firebase/firestore';

export interface Message {
  message: string;
  date: Timestamp;
  userName: string;
  photoURL: string;
}
