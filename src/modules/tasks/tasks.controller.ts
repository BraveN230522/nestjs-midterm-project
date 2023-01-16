import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
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

  @Post()
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
}
