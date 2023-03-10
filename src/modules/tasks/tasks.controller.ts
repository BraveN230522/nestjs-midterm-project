import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator, RolesGuard, UserDecorator } from '../../common';
import { Role } from '../../enums';
import { Task } from '../entities/tasks.entity';
import { User } from '../entities/users.entity';
import { CreateTaskDto, GetTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard(), RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Body() getTaskDto: GetTaskDto, @UserDecorator() currentUser) {
    return this.tasksService.getTasks(getTaskDto, currentUser);
  }

  @Get('/:id')
  getTask(@Param('id') id) {
    return this.tasksService.getTask(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @UserDecorator() user: User): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id')
  updateTask(@Param('id') id, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete('/:id')
  @RoleDecorator(Role.ADMIN)
  deleteTask(@Param('id') id): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
