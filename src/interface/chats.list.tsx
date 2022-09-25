export interface IChatsList {
    chatId: string;
    userId: string;
    myId: string;
    unread: number;
    lastName?: string;
    firstName?: string;
    chatIdArr?: Array<string>;
    avatar?: string;
    email?:string;
}
export interface IMessage {
    message: string;
}
export interface IAllChatList {
    isEmpty: boolean;
    list: Array<IChatsList>;
    isLoading: boolean;
    error?: IMessage;
    success?: IMessage;
}