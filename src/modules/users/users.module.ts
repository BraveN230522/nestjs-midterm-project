import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { User } from './Users.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { Task } from '../tasks/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task]), PassportModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
