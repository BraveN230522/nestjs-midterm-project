import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base/base.repository';
import { Priority } from '../entities/priorities.entity';

@Injectable()
export class PrioritiesRepository extends BaseRepository<Priority> {
  constructor(
    @InjectRepository(Priority)
    repository: Repository<Priority>,
  ) {
    super(repository);
  }
}
