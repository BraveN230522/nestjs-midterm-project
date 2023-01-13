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

  async createTask(createTaskDto): Promise<Task> {
    try {
      const { name, status, username, password } = createTaskDto;
      const salt = bcrypt.genSaltSync(1);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // const user = this.tasksRepository.create({
      //   name,
      //   status: status || TaskStatus.Inactive,
      //   auth: auth,
      // });

      // console.log({ user, auth });

      // await this.authRepository.save(auth);
      // await this.tasksRepository.save(user);

      return null;
    } catch (error) {
      console.log({ error });
      if (error.code === '23505')
        throw new ConflictException('This name already exists');
      else throw new InternalServerErrorException();
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
