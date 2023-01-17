import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './../../base/base.repository';
import { Task } from './tasks.entity';

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
  constructor(
    @InjectRepository(Task)
    repository: Repository<Task>,
  ) {
    super(repository);
  }
}
