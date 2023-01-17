import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { User } from '../users/users.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TasksController } from './tasks.controller';
import { Task } from './tasks.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Task, User]), PassportModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, UsersService],
})
export class TasksModule {}
