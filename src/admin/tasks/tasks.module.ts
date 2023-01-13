import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './tasks.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';
import { Auth } from '../auth/auth.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Auth, User]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, AuthRepository],
})
export class TasksModule {}
