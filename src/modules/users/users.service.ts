import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { json } from 'express';
import { assignIfHasKey } from '../../utilities';
import { Task } from '../tasks/tasks.entity';
import { TasksService } from '../tasks/tasks.service';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';
import { ErrorHelper } from '../../helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository, // @Inject(forwardRef(() => TasksService)) // private readonly tasksService: TasksService,
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
    return await this.usersRepository.findOneByRaw({ username });
  }

  async getUser(id): Promise<User> {
    const found = await this.usersRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`User ${id} is not found`);

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
      if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
      else ErrorHelper.InternalServerErrorException();
    }
  }

  async deleteUser(id): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`User ${id} is not found`);
  }

  async updateUser(id, updateUserDto): Promise<User> {
    const user = await this.getUser(id);
    assignIfHasKey(user, updateUserDto);

    await this.usersRepository.save([user]);

    return user;
  }
}
