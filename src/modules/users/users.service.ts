import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { REGEX_PATTERN } from '../../constants';
import { EncryptHelper, ErrorHelper } from '../../helpers';
import { APP_MESSAGE } from '../../messages';
import { assignIfHasKey, checkNotExists, matchWord } from '../../utilities';
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
    let found;
    if (REGEX_PATTERN.test(id)) found = await this.usersRepository.findOneBy({ inviteId: id });
    else found = await this.usersRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`User ${id} is not found`);

    return found;
  }

  async getCurrentUser(user): Promise<User> {
    return user;
  }

  async createUser(createUserDto): Promise<any> {
    const { defaultProjects } = createUserDto;
    const projects = await this.projectsRepository.findByIds(defaultProjects);

    const notExistsProjects = checkNotExists(defaultProjects, projects);
    if (notExistsProjects.length > 0)
      ErrorHelper.ConflictException(`Projects ${notExistsProjects} not exist`);

    try {
      const user = this.usersRepository.create({
        projects: projects,
      });
      await this.usersRepository.save([user]);
      const mappingUser = _.omit(user, ['projects']);
      return mappingUser;
    } catch (error) {
      ErrorHelper.InternalServerErrorException();
    }
  }

  async deleteUser(id): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`User ${id} is not found`);
  }

  async updateUser(id, updateUserDto): Promise<string> {
    const user = await this.getUser(id);
    try {
      assignIfHasKey(user, updateUserDto);

      await this.usersRepository.save([user]);

      return APP_MESSAGE.UPDATED_SUCCESSFULLY('user');
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail as string;
        const uniqueArr = ['name', 'username'];
        uniqueArr.forEach((item) => {
          if (matchWord(detail, item) !== null) {
            ErrorHelper.ConflictException(`This ${item} already exists`);
          }
        });
      } else ErrorHelper.InternalServerErrorException();
    }
  }
}
