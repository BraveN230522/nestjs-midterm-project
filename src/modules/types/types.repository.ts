import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base/base.repository';
import { Type } from '../entities/types.entity';

@Injectable()
export class TypesRepository extends BaseRepository<Type> {
  constructor(
    @InjectRepository(Type)
    repository: Repository<Type>,
  ) {
    super(repository);
  }
}
