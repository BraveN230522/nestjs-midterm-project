import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Task } from '../tasks/tasks.entity';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { User } from './Users.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TasksModule, TypeOrmModule.forFeature([User, Task]), PassportModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, TasksService],
  exports: [UsersRepository],
})
export class UsersModule {}
