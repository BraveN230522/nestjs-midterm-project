import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Task } from '../entities/tasks.entity';
import { User } from '../entities/users.entity';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task]), PassportModule, TasksModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, TasksService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
