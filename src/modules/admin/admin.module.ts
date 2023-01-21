import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Admin } from '../entities/admin.entity';
import { User } from '../entities/users.entity';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User]), PassportModule],
  exports: [AdminRepository],
  providers: [AdminService, AdminRepository],
  controllers: [AdminController],
})
export class AdminModule {}
