export class Message {
  userId: string;
  userImg: string;
  userName: string;
  timestamp: number;
  messageText: string;

  constructor(obj?: any){
    this.userId = obj ? obj.userId : '';
    this.userImg = obj ? obj.userImg : '';
    this.userName = obj ? obj.userName : '';
    this.timestamp = obj ? obj.timestamp : new Date().getTime();
    this.messageText = obj ? obj.messageText : '';
  }

  public toJSON(): any{
      return {
        userId: this.userId,
        userImg: this.userImg,
        userName: this.userName,
        timestamp: this.timestamp,
        messageText:this.messageText,
      }
  }

}
