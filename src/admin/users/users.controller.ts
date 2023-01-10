import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IUser } from '../../interfaces';
import { CreateUserDto, FilterUserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import _ from 'lodash';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(@Query() filterUserDto: FilterUserDto) {
    if (_.keys(filterUserDto).length)
      return this.usersService.filterUsers(filterUserDto);
    else return this.usersService.getUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): IUser {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/:id')
  getUser(@Param('id') id): IUser {
    return this.usersService.getUser(id);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id): IUser[] {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id, @Body() updateUserDto: CreateUserDto): IUser {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
