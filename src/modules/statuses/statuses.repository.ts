import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base/base.repository';
import { Status } from '../entities/statuses.entity';

@Injectable()
export class StatusesRepository extends BaseRepository<Status> {
  constructor(
    @InjectRepository(Status)
    repository: Repository<Status>,
  ) {
    super(repository);
  }
}
