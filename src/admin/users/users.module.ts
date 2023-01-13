import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { User } from './Users.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';
import { Auth } from '../auth/auth.entity';
import { Task } from '../tasks/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auth, Task]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AuthRepository],
})
export class UsersModule {}
