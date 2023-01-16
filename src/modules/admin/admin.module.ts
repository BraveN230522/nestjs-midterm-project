import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { AdminController } from './admin.controller';
import { Admin } from './admin.entity';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User])],
  exports: [AdminRepository],
  providers: [AdminService, AdminRepository],
  controllers: [AdminController],
})
export class AdminModule {}
