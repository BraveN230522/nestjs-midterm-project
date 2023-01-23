import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Priority } from '../entities/priorities.entity';
import { Project } from '../entities/projects.entity';
import { Status } from '../entities/statuses.entity';
import { Task } from '../entities/tasks.entity';
import { Type } from '../entities/types.entity';
import { User } from '../entities/users.entity';
import { PrioritiesRepository } from '../priorities/priorities.repository';
import { PrioritiesService } from '../priorities/priorities.service';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectsRepository } from '../projects/projects.repository';
import { ProjectsService } from '../projects/projects.service';
import { StatusesRepository } from '../statuses/statuses.repository';
import { StatusesService } from '../statuses/statuses.service';
import { TypesRepository } from '../types/types.repository';
import { TypesService } from '../types/types.service';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Type, Priority, Status, Project]),
    PassportModule,
    ProjectsModule,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    UsersService,
    UsersRepository,
    ProjectsService,
    ProjectsRepository,
    PrioritiesService,
    PrioritiesRepository,
    StatusesService,
    StatusesRepository,
    TypesService,
    TypesRepository,
  ],
  exports: [TasksRepository],
})
export class TasksModule {}
