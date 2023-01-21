import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Project } from '../entities/projects.entity';
import { Task } from '../entities/tasks.entity';
import { User } from '../entities/users.entity';
import { ProjectsRepository } from '../projects/projects.repository';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { ProjectsModule } from './../projects/projects.module';
import { ProjectsService } from './../projects/projects.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task, Project]),
    PassportModule,
    TasksModule,
    ProjectsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, TasksService, ProjectsService, ProjectsRepository],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
