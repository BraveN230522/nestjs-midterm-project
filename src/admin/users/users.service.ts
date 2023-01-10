import { Injectable } from '@nestjs/common';
// import { IUser } from '../../interfaces';
import { UserStatus } from '../../enums';
import { v4 as uuid } from 'uuid';
import { IUser } from '../../interfaces';

@Injectable()
export class UsersService {
  private users: IUser[] = [];

  getAllUsers(): IUser[] {
    return this.users;
  }

  createUser(name: string, status: UserStatus): IUser {
    const user: IUser = {
      id: uuid(),
      name,
      status,
    };

    this.users.push(user);

    return user;
  }
}
