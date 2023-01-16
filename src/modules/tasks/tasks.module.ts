import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/users.entity';
import { TasksController } from './tasks.controller';
import { Task } from './tasks.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
