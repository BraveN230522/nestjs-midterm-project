import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ErrorHelper } from '../../helpers';
import { IPaginationResponse } from '../../interfaces';
import { assignIfHasKey, datesToISOString } from '../../utilities';
import { Task } from '../entities/tasks.entity';
import { User } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/tasks.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  authRepository: any;
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository, // private usersService: UsersService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async getTasks(filterTaskDto): Promise<IPaginationResponse<Task>> {
    const { page, perPage } = filterTaskDto;
    return this.tasksRepository.paginationRepository(this.tasksRepository, {
      page,
      perPage,
    });
  }

  async getTask(id): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`Task ${id} is not found`);

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
      if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
      else ErrorHelper.InternalServerErrorException();
    }
  }

  async deleteTask(id): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`Task ${id} is not found`);
  }

  async updateTask(id, updateTaskDto): Promise<Task> {
    const user = await this.getTask(id);
    assignIfHasKey(user, updateTaskDto);

    await this.tasksRepository.save([user]);

    return user;
  }

  async getUserTasks(id, userTasksDto): Promise<IPaginationResponse<Task>> {
    const queryBuilderRepo = await this.tasksRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.user', 'u')
      .where('t.userId = :id', { id: id })
      .select(['t', 'u.id', 'u.name']);

    return await this.tasksRepository.paginationQueryBuilder(queryBuilderRepo, userTasksDto, true);
  }
}
