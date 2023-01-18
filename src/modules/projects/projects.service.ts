import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { IPaginationResponse } from '../../interfaces';
import { datesToISOString } from '../../utilities';
import { User } from '../users/users.entity';
import { UsersRepository } from '../users/users.repository';
import { ErrorHelper } from './../../helpers/error.helper';
import { CreateProjectDto } from './dto/projects.dto';
import { Project } from './projects.entity';
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
    const found = await this.projectsRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`Task ${id} is not found`);

    return found;
  }

  async getProjectMembers(id, getProjectsDto): Promise<any> {
    const queryBuilderRepo = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.projects', 'projects')
      .where('projects.id = :projectId', { projectId: id });
    // .select(['t', 'u.id', 'u.name'])

    // return queryBuilderRepo;

    return await this.usersRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getProjectsDto,
      false,
    );
  }

  async addMembers(ids): Promise<any> {
    const members: number[] = JSON.parse(ids);
    // console.log({ ids });
    const data = this.usersRepository.findByIds(members);
    return data;
    // const projectId = Number(req.params.id)
    // const projectRepository = myDataSource.getRepository(Projects)
    // const projectToUpdate = await projectRepository.findOne({
    //   where: { id: projectId },
    //   relations: ['users'],
    // })

    // const members: number[] = JSON.parse(req.body.memberIds)

    // const membersOfProject = await myDataSource.getRepository(Users).find({ where: { id: In(members) } })
    // if (projectToUpdate) {
    //   const memberShouldBeAdded = _.differenceBy(membersOfProject, projectToUpdate.users, 'id')

    //   projectToUpdate.users = [...projectToUpdate.users, ...memberShouldBeAdded]
    //   await projectRepository.save(projectToUpdate)
    //   res.status(200).json(dataMappingSuccess({ data: projectToUpdate }))
    // } else {
    //   return res.status(404).json(dataMapping({ message: 'No projects found' }))
    // }
  }
}
