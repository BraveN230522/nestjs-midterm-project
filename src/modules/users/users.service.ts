import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { ErrorHelper } from '../../helpers';
import { assignIfHasKey } from '../../utilities';
import { User } from '../entities/users.entity';
import { ProjectsRepository } from '../projects/projects.repository';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository, // @Inject(forwardRef(() => TasksService)) // private readonly tasksService: TasksService,
    private projectsRepository: ProjectsRepository,
  ) {}

  async getUsers(getUserDto): Promise<any> {
    const { page, perPage } = getUserDto;

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

  async createUser(createUserDto): Promise<any> {
    try {
      const { defaultProjects } = createUserDto;
      const projects = await this.projectsRepository.findByIds(defaultProjects);

      const user = this.usersRepository.create({
        projects: projects,
      });

      await this.usersRepository.save([user]);

      const mappingUser = _.omit(user, ['projects']);

      return mappingUser;
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
