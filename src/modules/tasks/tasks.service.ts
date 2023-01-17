import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { FindOneOptions } from 'typeorm';
import { assignIfHasKey, datesToISOString } from '../../utilities';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/tasks.dto';
import { Task } from './tasks.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  authRepository: any;
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
    private usersService: UsersService,
  ) {}

  async getTasks(filterTaskDto, options?: FindOneOptions<Task>): Promise<Task[]> {
    const { page, perPage } = filterTaskDto;
    return this.tasksRepository.paginationRepository(
      this.tasksRepository,
      {
        page,
        perPage,
      },
      options,
    );
  }

  async getTask(id): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) throw new NotFoundException(`Task ${id} is not found`);

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, currentUser: User): Promise<Task> {
    try {
      const { name, userId, startDate, endDate } = createTaskDto;
      const [formattedStartDate, formattedEndDate] = datesToISOString([startDate, endDate]);
      const user = await this.usersService.getUser(userId);
      const task = this.tasksRepository.create({
        name,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        user: user || currentUser,
      });

      await this.tasksRepository.save([task]);

      const mappingTask = _.omit(task, ['user']) as Task;

      return mappingTask;
    } catch (error) {
      console.log({ error });
      if (error.code === '23505') throw new ConflictException('This name already exists');
      else throw new InternalServerErrorException();
    }
  }

  async deleteTask(id): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Task ${id} is not found`);
  }

  async updateTask(id, updateTaskDto): Promise<Task> {
    const user = await this.getTask(id);
    assignIfHasKey(user, updateTaskDto);

    await this.tasksRepository.save([user]);

    return user;
  }
}
