import { UserStatus } from '../enums';

export interface IUser {
  id: string;
  // inviteId: string;
  name: string;
  // dob: string;
  // email: string;
  // password: string;
  status: UserStatus;
  // tasks: string;
  // projects: string;
}
