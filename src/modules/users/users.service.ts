import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { UserDecorator } from '../../common';
import { assignIfHasKey } from '../../utilities';
import { Task } from '../tasks/tasks.entity';
import { TasksService } from '../tasks/tasks.service';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private tasksService: TasksService,
  ) {}

  async getUsers(filterUserDto): Promise<any> {
    const { page, perPage } = filterUserDto;

    // const query = this.usersRepository.createQueryBuilder('user');

    // if (status) query.andWhere('user.status = :status', { status });

    // if (search)
    //   query.andWhere('LOWER(user.name) LIKE LOWER(:search)', {
    //     search: `%${search}%`,
    //   });

    // const tasks = await query.getMany();

    return this.usersRepository.paginationRepository(this.usersRepository, {
      page,
      perPage,
    });
    // return tasks;
  }

  async getUserByUsername({ username }): Promise<User> {
    return await this.usersRepository.findOneRaw({ username });
  }

  async getUser(id): Promise<User> {
    const found = await this.usersRepository.findOneBy({ id });

    if (!found) throw new NotFoundException(`User ${id} is not found`);

    return found;
  }

  async getCurrentUser(user): Promise<User> {
    return user;
  }

  async createUser(createUserDto): Promise<User> {
    try {
      const { name, status, username, password } = createUserDto;
      const salt = bcrypt.genSaltSync(1);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // const auth = this.authRepository.create({
      //   username,
      //   password: hashedPassword,
      // });

      const user = this.usersRepository.create({
        name,
        username,
        password: hashedPassword,
        status: status,
        // auth: auth,
      });

      // console.log({ user, auth });

      // await this.authRepository.save(auth);
      await this.usersRepository.save([user]);

      return user;
    } catch (error) {
      console.log({ error });
      if (error.code === '23505') throw new ConflictException('This name already exists');
      else throw new InternalServerErrorException();
    }
  }

  async deleteUser(id): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`User ${id} is not found`);
  }

  async updateUser(id, updateUserDto): Promise<User> {
    const user = await this.getUser(id);
    assignIfHasKey(user, updateUserDto);

    await this.usersRepository.save([user]);

    return user;
  }

  async getUserTasks(id, userTasksDto): Promise<Task[]> {
    return await this.tasksService.getTasks(userTasksDto, { where: { id } });
    // const user = await this.getUser(id);
    // assignIfHasKey(user, updateUserDto);
    // await this.usersRepository.save([user]);
    // return user;
  }
}
