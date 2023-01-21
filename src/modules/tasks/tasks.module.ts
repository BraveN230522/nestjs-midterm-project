import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Task } from '../entities/tasks.entity';
import { User } from '../entities/users.entity';
import { ProjectsModule } from '../projects/projects.module';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), PassportModule, ProjectsModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, UsersService, UsersRepository],
  exports: [TasksRepository],
})
export class TasksModule {}
