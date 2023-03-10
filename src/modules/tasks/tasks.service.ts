import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import moment from 'moment';
import { Role } from '../../enums';
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
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
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

  async getTasks(getTaskDto, currentUser: User): Promise<IPaginationResponse<Task>> {
    let queryBuilderRepo = await this.tasksRepository
      .createQueryBuilder('t')
      .leftJoin('t.status', 's')
      .leftJoin('t.priority', 'p')
      .orderBy('s.order', 'DESC')
      // .orderBy('p.order', 'ASC')
      .select([
        't.id',
        't.name',
        't.startDate',
        't.endDate',
        's.id',
        's.name',
        's.order',
        'p.id',
        'p.name',
        'p.order',
      ]);

    if (currentUser.role === Role.USER) {
      queryBuilderRepo = await this.tasksRepository
        .createQueryBuilder('t')
        .leftJoin('t.status', 's')
        .leftJoin('t.priority', 'p')
        .leftJoin('t.user', 'u')
        .orderBy('s.order', 'DESC')
        // .orderBy('p.order', 'ASC')
        .where('u.id = :userId', { userId: currentUser.id })
        .select([
          't.id',
          't.name',
          't.startDate',
          't.endDate',
          's.id',
          's.name',
          's.order',
          'p.id',
          'p.name',
          'p.order',
        ]);
    }

    return this.tasksRepository.paginationQueryBuilder(queryBuilderRepo, getTaskDto, true);
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

  validateTaskDate(taskDates, projectDates) {
    const startDateTask = moment(taskDates.endDate);
    const startDateProject = moment(projectDates.endDate);
    const endDateTask = moment(taskDates.startDate);
    const endDateProject = moment(projectDates.startDate);

    const diffTimeStartDate = moment(startDateTask).diff(startDateProject);
    const diffTimeEndDate = moment(endDateTask).diff(endDateProject);

    if (diffTimeStartDate > 0 || diffTimeEndDate < 0)
      ErrorHelper.BadRequestException('Date of task need to be in range of project');
  }

  async createTask(createTaskDto: CreateTaskDto, currentUser: User): Promise<Task> {
    const { name, userId, typeId, priorityId, statusId, projectId, startDate, endDate } =
      createTaskDto;

    const type = await this.typesService.getType(typeId);
    const priority = await this.prioritiesService.getPriority(priorityId);
    const status = await this.statusesService.getStatus(statusId);
    const project = await this.projectsService.getProject(projectId);
    const user = await this.usersService.getUser(userId);
    const [formattedStartDate, formattedEndDate] = datesToISOString([startDate, endDate]);

    this.validateTaskDate(
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
      {
        startDate: project.startDate,
        endDate: project.endDate,
      },
    );

    try {
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
      ErrorHelper.InternalServerErrorException();
    }
  }

  async deleteTask(id): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`Task ${id} is not found`);
  }

  async updateTask(id, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { userId, typeId, priorityId, statusId, projectId } = updateTaskDto;

    const task = await this.getTask(id);
    const type = await this.typesService.getType(typeId);
    const priority = await this.prioritiesService.getPriority(priorityId);
    const status = await this.statusesService.getStatus(statusId);
    const project = await this.projectsService.getProject(projectId);
    const user = await this.usersService.getUser(userId);

    assignIfHasKey(task, { ...updateTaskDto, type, priority, status, project, user });

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
