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
import { CreateTaskDto, FilterTaskDto } from './dto/tasks.dto';
import { TasksService } from './tasks.service';
import _ from 'lodash';
import { Task } from './tasks.entity';

@Controller('tasks')
// @UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // getTasks(@Query() filterTaskDto: FilterTaskDto) {
  //   return this.tasksService.getTasks(filterTaskDto);
  // }

  // @Get('/:id')
  // getTask(@Param('id') id): Promise<Task> {
  //   return this.tasksService.getTask(id);
  // }

  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
  //   return this.tasksService.createTask(createTaskDto);
  // }

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
