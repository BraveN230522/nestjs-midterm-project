import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { REGEX_PATTERN } from '../../constants';
import { EncryptHelper, ErrorHelper } from '../../helpers';
import { APP_MESSAGE } from '../../messages';
import { assignIfHasKey, matchWord } from '../../utilities';
import { User } from '../entities/users.entity';
import { ProjectsRepository } from '../projects/projects.repository';
import { RegisterUserDto } from './dto/users.dto';
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

  async register(uuid, registerUserDto: RegisterUserDto): Promise<string> {
    const user = await this.getUser(uuid);

    if (user.isRegistered) ErrorHelper.BadRequestException('User has been registered');

    try {
      const password = await EncryptHelper.hash(registerUserDto.password, 1);
      assignIfHasKey(user, { ...registerUserDto, password, isRegistered: true });

      await this.usersRepository.save([user]);

      return APP_MESSAGE.UPDATED_SUCCESSFULLY('user');
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail as string;
        const uniqueArr = ['name', 'username'];

        uniqueArr.forEach((item) => {
          if (matchWord(detail, item) !== null)
            ErrorHelper.ConflictException(`This ${item} already exists`);
        });
      } else ErrorHelper.InternalServerErrorException();
    }
  }
}
