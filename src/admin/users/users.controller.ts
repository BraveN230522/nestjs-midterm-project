import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, FilterUserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import _ from 'lodash';
import { User } from './users.entity';
import { RolesGuard } from '../../common/guards';
import { RoleDecorator } from '../../common/decorators';
import { Role } from '../../enums';

@Controller('users')
// @UseGuards(AuthGuard())
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RoleDecorator(Role.ADMIN)
  getUsers(@Query() filterUserDto: FilterUserDto) {
    return this.usersService.getUsers(filterUserDto);
  }

  @Get('/:id')
  @RoleDecorator(Role.SUPER_ADMIN)
  getUser(@Param('id') id): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
