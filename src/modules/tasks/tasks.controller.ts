import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
  getTasks(@Body() getTaskDto: GetTaskDto) {
    return this.tasksService.getTasks(getTaskDto);
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

  @Patch('/:id')
  // @RoleDecorator(Role.ADMIN)
  updateProject(@Param('id') id, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
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
}
