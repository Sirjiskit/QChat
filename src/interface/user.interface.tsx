export interface IUser {
  uuid: string;
  createdAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  department: number;
  phoneNumber: string;
  token?: string;
}

