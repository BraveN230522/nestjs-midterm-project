import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Project } from '../entities/projects.entity';
import { User } from '../entities/users.entity';
import { UsersRepository } from '../users/users.repository';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User]), PassportModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository, UsersRepository],
  exports: [ProjectsRepository, ProjectsService],
})
export class ProjectsModule {}
