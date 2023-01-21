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
import { AuthGuard } from '@nestjs/passport';
import { instanceToPlain } from 'class-transformer';
import _ from 'lodash';
import { RoleDecorator, UserDecorator } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { Role } from '../../enums';
import { IPaginationResponse } from '../../interfaces';
import { Task } from '../entities/tasks.entity';
import { User } from '../entities/users.entity';
import { ProjectsService } from '../projects/projects.service';
import { FilterTaskDto } from '../tasks/dto/tasks.dto';
import { TasksService } from '../tasks/tasks.service';
import { CreateUserDto, FilterUserDto, UpdateUserDto, UserTasksDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
// @UseGuards(AuthGuard())
@UseGuards(AuthGuard(), RolesGuard)
@RoleDecorator(Role.SUPER_ADMIN)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
  ) {}

  @Get()
  @RoleDecorator(Role.USER, Role.ADMIN)
  getUsers(@Body() filterUserDto: FilterUserDto) {
    return this.usersService.getUsers(filterUserDto);
  }

  @Get('/me')
  @RoleDecorator(Role.USER)
  getCurrentUser(@UserDecorator() currentUser): Promise<User> {
    return this.usersService.getCurrentUser(currentUser);
  }

  @Get('/:id')
  @RoleDecorator(Role.USER, Role.ADMIN)
  getUser(@Param('id') id): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Post()
  @RoleDecorator(Role.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete('/:id')
  @RoleDecorator(Role.ADMIN)
  deleteUser(@Param('id') id): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id')
  @RoleDecorator(Role.ADMIN)
  updateUser(@Param('id') id, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get('/tasks/:id')
  @RoleDecorator(Role.USER, Role.ADMIN)
  getUserTasks(
    @Param('id') id,
    @Body() filterTaskDto: FilterTaskDto,
  ): Promise<IPaginationResponse<Task>> {
    return this.tasksService.getUserTasks(id, filterTaskDto);
  }

  @Get('/projects/:id')
  @RoleDecorator(Role.USER, Role.ADMIN)
  getUserProjects(
    @Param('id') id,
    @Body() filterTaskDto: FilterTaskDto,
  ): Promise<IPaginationResponse<Task>> {
    return this.projectsService.getUserProjects(id, filterTaskDto);
  }
}
