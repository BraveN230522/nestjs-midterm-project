import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    repository: Repository<Task>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
