import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import _ from 'lodash';
import { ErrorHelper } from '../../helpers';
import { IPaginationResponse } from '../../interfaces';
import { assignIfHasKey, datesToISOString } from '../../utilities';
import { Task } from '../entities/tasks.entity';
import { User } from '../entities/users.entity';
import { PrioritiesService } from '../priorities/priorities.service';
import { ProjectsService } from '../projects/projects.service';
import { StatusesService } from '../statuses/statuses.service';
import { UsersService } from '../users/users.service';
import { TypesService } from './../types/types.service';
import { CreateTaskDto } from './dto/tasks.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository, // private usersService: UsersService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly typesService: TypesService,
    private readonly prioritiesService: PrioritiesService,
    private readonly statusesService: StatusesService,
    private readonly projectsService: ProjectsService,
  ) {}

  async getTasks(getTaskDto): Promise<IPaginationResponse<Task>> {
    const { page, perPage } = getTaskDto;
    return this.tasksRepository.paginationRepository(this.tasksRepository, {
      page,
      perPage,
    });
  }

  async getTask(id): Promise<Task> {
    const found = await this.tasksRepository.findOneRaw(
      { id: id },
      { relations: ['user', 'project', 'status', 'priority', 'type'] },
    );
    if (!found) ErrorHelper.NotFoundException(`Task ${id} is not found`);

    const mappingTask = {
      ...found,
      user: _.pick(found.user, ['id', 'name']),
      project: _.pick(found.project, ['id', 'name']),
      status: _.pick(found.status, ['id', 'name']),
      priority: _.pick(found.priority, ['id', 'name']),
      type: _.pick(found.type, ['id', 'name']),
    };

    return mappingTask as Task;
  }

  async createTask(createTaskDto: CreateTaskDto, currentUser: User): Promise<Task> {
    const { name, userId, typeId, priorityId, statusId, projectId, startDate, endDate } =
      createTaskDto;

    const type = await this.typesService.getType(typeId);
    const priority = await this.prioritiesService.getPriority(priorityId);
    const status = await this.statusesService.getStatus(statusId);
    const project = await this.projectsService.getProject(projectId);
    const user = await this.usersService.getUser(userId);
    try {
      const [formattedStartDate, formattedEndDate] = datesToISOString([startDate, endDate]);
      const task = this.tasksRepository.create({
        name,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        user: user || currentUser,
        type,
        priority,
        status,
        project,
      });

      const res = await this.tasksRepository.save([task]);

      return res?.[0];
    } catch (error) {
      if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
      else ErrorHelper.InternalServerErrorException();
    }
  }

  async deleteTask(id): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`Task ${id} is not found`);
  }

  async updateTask(id, updateTaskDto): Promise<Task> {
    const task = await this.getTask(id);
    assignIfHasKey(task, updateTaskDto);

    await this.tasksRepository.save([task]);

    return task;
  }

  async getUserTasks(id, getUserTasksDto): Promise<IPaginationResponse<Task>> {
    const queryBuilderRepo = await this.tasksRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.user', 'u')
      .where('t.userId = :id', { id: id })
      .select(['t', 'u.id', 'u.name']);

    return await this.tasksRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getUserTasksDto,
      true,
    );
  }
}
