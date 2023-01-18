import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base';
import { Project } from './projects.entity';

@Injectable()
export class ProjectsRepository extends BaseRepository<Project> {
  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
  ) {
    super(repository);
  }
}
