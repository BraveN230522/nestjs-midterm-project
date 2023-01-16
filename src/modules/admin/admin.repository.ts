import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(
    @InjectRepository(Admin)
    repository: Repository<Admin>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
