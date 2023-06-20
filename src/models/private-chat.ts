import { User } from "./user.model";
import { Timestamp } from 'firebase/firestore';

export interface PrivateChat {
    id: string;
    userIds: string[];
    users: User[];


    chatPic?: string;
    chatName?: string;
}

export interface privateMessage {
    messageId: string;
    text: string;
    senderId: string;
    displayName: string;
    photoURL: string;
    sentDate: Date & Timestamp;
}
