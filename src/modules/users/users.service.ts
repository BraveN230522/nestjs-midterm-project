import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { ErrorHelper } from '../../helpers';
import { assignIfHasKey } from '../../utilities';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository, // @Inject(forwardRef(() => TasksService)) // private readonly tasksService: TasksService,
  ) {}

  async getUsers(filterUserDto): Promise<any> {
    const { page, perPage } = filterUserDto;

    return this.usersRepository.paginationRepository(this.usersRepository, {
      page,
      perPage,
    });
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
      console.log({ status });
      const salt = bcrypt.genSaltSync(1);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = this.usersRepository.create({
        name,
        username,
        password: hashedPassword,
        status: status,
      });

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
