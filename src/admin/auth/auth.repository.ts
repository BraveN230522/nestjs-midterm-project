import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(
    @InjectRepository(Auth)
    repository: Repository<Auth>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
