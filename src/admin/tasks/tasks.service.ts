import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { assignIfHasKey } from '../../utilities';
import { AuthRepository } from '../auth/auth.repository';
import { Task } from './tasks.entity';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/tasks.dto';
import { User } from '../users/users.entity';

@Injectable()
export class TasksService {
  authRepository: any;
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterTaskDto): Promise<Task[]> {
    const { search, status } = filterTaskDto;

    const query = this.tasksRepository.createQueryBuilder('user');

    if (status) query.andWhere('user.status = :status', { status });

    if (search)
      query.andWhere('LOWER(user.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });

    const tasks = await query.getMany();

    return tasks;
  }

  async getTask(id): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) throw new NotFoundException(`Task ${id} is not found`);

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      const { name, startDate, endDate } = createTaskDto;

      const task = this.tasksRepository.create({
        name,
        startDate,
        endDate,
        user,
      });

      await this.tasksRepository.save(task);

      return task;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteTask(id): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Task ${id} is not found`);
  }

  async updateTask(id, updateTaskDto): Promise<Task> {
    const user = await this.getTask(id);
    assignIfHasKey(user, updateTaskDto);

    await this.tasksRepository.save(user);

    return user;
  }
}
