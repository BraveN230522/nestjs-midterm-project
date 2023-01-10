import { Injectable, NotFoundException } from '@nestjs/common';
// import { IUser } from '../../interfaces';
import { UserStatus } from '../../enums';
import { v4 as uuid } from 'uuid';
import { IUser } from '../../interfaces';
import _ from 'lodash';
import { assignIfHasKey } from '../../utilities';

@Injectable()
export class UsersService {
  private users: IUser[] = [];

  getUsers(): IUser[] {
    return this.users;
  }

  filterUsers(filterUserDto): IUser[] {
    const { search, status } = filterUserDto;
    let users = this.getUsers();

    if (search) users = _.filter(users, (user) => user.name.includes(search));

    if (status) users = _.filter(users, (user) => user.status === status);

    return users;
  }

  createUser(createUserDto): IUser {
    const { name, status } = createUserDto;
    const user: IUser = {
      id: uuid(),
      name,
      status,
    };

    this.users.push(user);

    return user;
  }

  getUser(id): IUser {
    const found = this.getUser(id);
    const user = _.find(this.users, (user) => user.id === found.id);

    if (!user) throw new NotFoundException();

    return user;
  }

  deleteUser(id): IUser[] {
    const found = this.getUser(id);
    const index = _.findIndex(this.users, (user) => user.id === found.id);
    _.remove(this.users, (_, i) => i === index);

    return this.users;
  }

  updateUser(id, updateUserDto): IUser {
    const user = this.getUser(id);
    console.log({ user });
    assignIfHasKey(user, updateUserDto);

    return user;
  }
}
