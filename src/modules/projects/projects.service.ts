import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import slugify from 'slugify';
import { PAGE_NO_LIMIT } from '../../constants';
import { IPaginationResponse } from '../../interfaces';
import { assignIfHasKey, datesToISOString } from '../../utilities';
import { Project } from '../entities/projects.entity';
import { User } from '../entities/users.entity';
import { UsersRepository } from '../users/users.repository';
import { ErrorHelper } from './../../helpers/error.helper';
import { CreateProjectDto } from './dto/projects.dto';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository) private projectsRepository: ProjectsRepository, // @Inject(forwardRef(() => TasksService)) // private readonly tasksService: TasksService,
    private usersRepository: UsersRepository,
  ) {}

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const { name, slug, startDate, endDate } = createProjectDto;
      const [formattedStartDate, formattedEndDate] = datesToISOString([startDate, endDate]);
      const generatedSlug = slugify(slug || name, { replacement: '-', lower: true });

      const project = this.projectsRepository.create({
        name,
        slug: generatedSlug,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      await this.projectsRepository.save([project]);

      // const mappingProject = _.omit(project, ['user']) as Project;

      return project;
    } catch (error) {
      console.log({ error });
      if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
      else ErrorHelper.InternalServerErrorException();
    }
  }

  async getProjects(filterTaskDto): Promise<IPaginationResponse<Project>> {
    const { page, perPage } = filterTaskDto;
    return this.projectsRepository.paginationRepository(this.projectsRepository, {
      page,
      perPage,
    });
  }

  async getProject(id): Promise<Project> {
    const found = await this.projectsRepository.findOneByRaw({ id });

    if (!found) ErrorHelper.NotFoundException(`Project ${id} is not found`);

    return found;
  }

  async getProjectMembers(id, getProjectsDto): Promise<IPaginationResponse<User>> {
    await this.getProject(id);

    const queryBuilderRepo = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.projects', 'projects')
      .where('projects.id = :projectId', { projectId: id });

    return await this.usersRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getProjectsDto,
      false,
    );
  }

  async updateProject(id, updateProjectDto): Promise<Project> {
    const project = await this.getProject(id);
    assignIfHasKey(project, updateProjectDto);

    await this.projectsRepository.save([project]);

    return project;
  }

  async addMembers(ids, id): Promise<Project[]> {
    const memberIds: number[] = JSON.parse(ids);
    const users = await this.usersRepository.findByIds(memberIds);
    const membersOfProject = await this.getProjectMembers(id, PAGE_NO_LIMIT);
    const project = await this.getProject(id);

    const memberShouldBeAdded = _.differenceBy(users, membersOfProject.items as User[], 'id');
    console.log({ memberShouldBeAdded, users });

    assignIfHasKey(project, {
      users: [...(membersOfProject.items as User[]), ...memberShouldBeAdded],
    });

    return await this.projectsRepository.save([project]);
  }

  async removeMembers(ids, id): Promise<Project[]> {
    const memberIds: number[] = JSON.parse(ids);
    const users = await this.usersRepository.findByIds(memberIds);
    const membersOfProject = await this.getProjectMembers(id, PAGE_NO_LIMIT);
    const project = await this.getProject(id);

    const memberAfterRemoving = _.differenceBy(membersOfProject.items as User[], users, 'id');
    assignIfHasKey(project, { users: memberAfterRemoving });

    return await this.projectsRepository.save([project]);
  }

  async deleteProject(id) {
    const result = await this.projectsRepository.delete(id);
    // .createQueryBuilder('p')
    // .where('id = :pId', { pId: id })
    // .delete()
    // .execute();

    if (result.affected === 0) ErrorHelper.NotFoundException(`Project ${id} is not found`);

    return 'Delete project successfully';
  }

  async getUserProjects(id, userTasksDto): Promise<IPaginationResponse<Project>> {
    const queryBuilderRepo = await this.projectsRepository
      .createQueryBuilder('p')
      .leftJoin('p.users', 'u')
      .where('u.id = :userId', { userId: id })
      .select(['p']);

    return await this.projectsRepository.paginationQueryBuilder(
      queryBuilderRepo,
      userTasksDto,
      true,
    );
  }
}
