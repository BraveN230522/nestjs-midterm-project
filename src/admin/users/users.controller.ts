import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from '../../interfaces';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(
    @Body('name') name: string,
    @Body('status') status: number,
  ): IUser {
    return this.usersService.createUser(name, status);
  }
}
