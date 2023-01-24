import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import slugify from 'slugify';
import { PAGE_NO_LIMIT } from '../../constants';
import { Role } from '../../enums';
import { IPaginationResponse } from '../../interfaces';
import { APP_MESSAGE } from '../../messages';
import { assignIfHasKey, datesToISOString, myMapPick } from '../../utilities';
import { Project } from '../entities/projects.entity';
import { Task } from '../entities/tasks.entity';
import { User } from '../entities/users.entity';
import { TasksRepository } from '../tasks/tasks.repository';
import { UsersRepository } from '../users/users.repository';
import { ErrorHelper } from './../../helpers/error.helper';
import { CreateProjectDto, GetProjectTasksDto, UpdateProjectDto } from './dto/projects.dto';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository) private projectsRepository: ProjectsRepository, // @Inject(forwardRef(() => TasksService)) // private readonly tasksService: TasksService,
    private usersRepository: UsersRepository,
    private tasksRepository: TasksRepository,
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
      if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
      else ErrorHelper.InternalServerErrorException();
    }
  }

  async getProjects(filterTaskDto, currentUser: User): Promise<IPaginationResponse<Project>> {
    let queryBuilderRepo = this.projectsRepository
      .createQueryBuilder('p')
      .leftJoin('p.tasks', 't')
      .leftJoin('t.status', 's')
      .select(['p', 't', 's']);

    if (currentUser.role === Role.USER) {
      queryBuilderRepo = this.projectsRepository
        .createQueryBuilder('p')
        .leftJoin('p.users', 'u')
        .leftJoin('p.tasks', 't')
        .leftJoin('t.status', 's')
        .where('u.id = :userId', { userId: currentUser.id })
        .select(['p', 't', 's']);
    }

    const data = await this.projectsRepository.paginationQueryBuilder(
      queryBuilderRepo,
      filterTaskDto,
      true,
    );

    const pickPropProjects = myMapPick(data.items, ['id', 'name', 'tasks']);
    const getProcess = (tasks: Task[]) => {
      if (tasks.length === 0) return 0;
      const closedTasks = tasks.filter((task) => task?.status?.order === 0);
      return closedTasks.length / tasks.length;
    };

    const mappingProjects = _.map(pickPropProjects, (project) => {
      return {
        id: project.id,
        name: project.name,
        taskTotal: project.tasks.length,
        process: getProcess(project.tasks),
      };
    });

    return {
      items: mappingProjects,
      pagination: data.pagination,
    };
  }

  async getProject(id): Promise<Project> {
    const found = await this.projectsRepository.findOneByRaw({ id });

    if (!found) ErrorHelper.NotFoundException(`Project ${id} is not found`);

    return found;
  }

  async getProjectMembers(id, getProjectMembersDto): Promise<IPaginationResponse<User>> {
    await this.getProject(id);

    const queryBuilderRepo = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.projects', 'projects')
      .where('projects.id = :projectId', { projectId: id });

    return await this.usersRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getProjectMembersDto,
      false,
    );
  }

  async updateProject(id, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.getProject(id);
    try {
      const { name, slug, startDate, endDate } = updateProjectDto;
      const [formattedStartDate, formattedEndDate] = datesToISOString([startDate, endDate]);
      const generatedSlug = slugify(slug || name || project.slug, {
        replacement: '-',
        lower: true,
      });
      assignIfHasKey(project, {
        ...updateProjectDto,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        slug: generatedSlug,
      });

      await this.projectsRepository.save([project]);

      return project;
    } catch (error) {
      if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
      else ErrorHelper.InternalServerErrorException();
    }
  }

  async addMembers(addMembersDto, id): Promise<string> {
    const { memberIds } = addMembersDto;
    const users = await this.usersRepository.findByIds(memberIds);
    const membersOfProject = await this.getProjectMembers(id, PAGE_NO_LIMIT);
    const project = await this.getProject(id);

    const memberShouldBeAdded = _.differenceBy(users, membersOfProject.items as User[], 'id');

    assignIfHasKey(project, {
      users: [...(membersOfProject.items as User[]), ...memberShouldBeAdded],
    });

    await this.projectsRepository.save([project]);

    return APP_MESSAGE.ADDED_SUCCESSFULLY('members');
  }

  async removeMembers(removeMembersDto, id): Promise<string> {
    const { memberIds } = removeMembersDto;
    const users = await this.usersRepository.findByIds(memberIds);
    const membersOfProject = await this.getProjectMembers(id, PAGE_NO_LIMIT);
    const project = await this.getProject(id);

    const memberAfterRemoving = _.differenceBy(membersOfProject.items as User[], users, 'id');
    assignIfHasKey(project, { users: memberAfterRemoving });

    await this.projectsRepository.save([project]);

    return APP_MESSAGE.REMOVED_SUCCESSFULLY('members');
  }

  async deleteProject(id) {
    const result = await this.projectsRepository.delete(id);
    // .createQueryBuilder('p')
    // .where('id = :pId', { pId: id })
    // .delete()
    // .execute();

    if (result.affected === 0) ErrorHelper.NotFoundException(`Project ${id} is not found`);

    return APP_MESSAGE.DELETED_SUCCESSFULLY('project');
  }

  async getUserProjects(id, getUserProjectsDto): Promise<IPaginationResponse<Project>> {
    const queryBuilderRepo = await this.projectsRepository
      .createQueryBuilder('p')
      .leftJoin('p.users', 'u')
      .where('u.id = :userId', { userId: id })
      .select(['p']);

    return await this.projectsRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getUserProjectsDto,
      true,
    );
  }

  async getTaskProjects(
    id,
    getProjectTasksDto: GetProjectTasksDto,
  ): Promise<IPaginationResponse<Task>> {
    const queryBuilderRepo = await this.tasksRepository
      .createQueryBuilder('t')
      .leftJoin('t.project', 'p')
      .leftJoin('t.status', 's')
      .select(['t.id', 't.name', 't.startDate', 't.endDate', 's.id', 's.name', 's.order'])
      .where('p.id = :projectId', { projectId: id });

    return await this.tasksRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getProjectTasksDto,
      true,
    );
  }
}
