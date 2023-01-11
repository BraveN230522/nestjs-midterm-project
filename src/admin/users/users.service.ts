import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
// import { IUser } from '../../interfaces';
import { UserStatus } from '../../enums';
import _ from 'lodash';
import { assignIfHasKey } from '../../utilities';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async getUsers(filterUserDto): Promise<User[]> {
    const { search, status } = filterUserDto;

    const query = this.usersRepository.createQueryBuilder('user');

    if (status) query.andWhere('user.status = :status', { status });

    if (search)
      query.andWhere('LOWER(user.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });

    const tasks = await query.getMany();

    return tasks;
  }

  async getUser(id): Promise<User> {
    const found = await this.usersRepository.findOneBy({ id });

    if (!found) throw new NotFoundException(`User ${id} is not found`);

    return found;
  }

  async createUser(createUserDto): Promise<User> {
    const { name, status } = createUserDto;
    const user = this.usersRepository.create({
      name,
      status: status || UserStatus.Inactive,
    });

    await this.usersRepository.save(user);

    return user;
  }

  async deleteUser(id): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`User ${id} is not found`);
  }

  async updateUser(id, updateUserDto): Promise<User> {
    const user = await this.getUser(id);
    assignIfHasKey(user, updateUserDto);

    await this.usersRepository.save(user);

    return user;
  }
}
