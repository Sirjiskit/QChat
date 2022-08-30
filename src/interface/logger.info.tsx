import { IUser } from './user.interface';
export interface IMessage {
  message: string;
}
export interface ILoggerInfo {
  isAuth: boolean;
  currentUser?: IUser;
  isLoading: boolean;
  isLogin?:boolean;
  error?: IMessage;
  success?: IMessage;
}