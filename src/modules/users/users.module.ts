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
import { ProjectsRepository } from '../projects/projects.repository';
import { StatusesRepository } from '../statuses/statuses.repository';
import { StatusesService } from '../statuses/statuses.service';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { TypesRepository } from '../types/types.repository';
import { TypesService } from '../types/types.service';
import { ProjectsModule } from './../projects/projects.module';
import { ProjectsService } from './../projects/projects.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task, Project, Type, Priority, Status]),
    PassportModule,
    TasksModule,
    ProjectsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    TasksService,
    ProjectsService,
    ProjectsRepository,
    PrioritiesService,
    PrioritiesRepository,
    StatusesService,
    StatusesRepository,
    TypesService,
    TypesRepository,
  ],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
