import { User } from "./user.model";
import { Timestamp } from 'firebase/firestore';

export interface PrivateChat {
    id: string;
    lastMessage?: string;
    lastMessageDate?: Date;
    userIds: string[];
    users: User[];


    chatPic?: string;
    chatName?: string;
}

export interface privateMessage {
    text: string;
    senderId: string;
    displayName: string;
    photoURL: string;
    sentDate: Date & Timestamp;
}
