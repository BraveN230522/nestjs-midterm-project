import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator, RolesGuard, UserDecorator } from '../../common';
import { Role } from '../../enums';
import { IPaginationResponse } from '../../interfaces';
import { User } from '../users/users.entity';
import { CreateTaskDto, FilterTaskDto } from './dto/tasks.dto';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard(), RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Body() filterTaskDto: FilterTaskDto) {
    return this.tasksService.getTasks(filterTaskDto);
  }

  // @Get('/:id')
  // getTask(@Param('id') id): Promise<Task> {
  //   return this.tasksService.getTask(id);
  // }

  @Post()
  @RoleDecorator(Role.USER)
  createTask(@Body() createTaskDto: CreateTaskDto, @UserDecorator() user: User): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  // @Delete('/:id')
  // deleteTask(@Param('id') id): Promise<void> {
  //   return this.tasksService.deleteTask(id);
  // }

  // @Patch('/:id')
  // updateTask(
  //   @Param('id') id,
  //   @Body() updateTaskDto: CreateTaskDto,
  // ): Promise<Task> {
  //   return this.tasksService.updateTask(id, updateTaskDto);
  // }

  @Get('/users/:id')
  @RoleDecorator(Role.USER, Role.ADMIN)
  getUserTasks(
    @Param('id') id,
    @Body() filterTaskDto: FilterTaskDto,
  ): Promise<IPaginationResponse<Task>> {
    return this.tasksService.getUserTasks(id, filterTaskDto);
  }
}
