import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(AdminRepository) private adminRepository: AdminRepository) {}

  async createAdmin({ username }): Promise<Admin> {
    return await this.adminRepository.findOneBy({ username });
  }

  async getAdminByUsername({ username }): Promise<Admin> {
    return await this.adminRepository.findOneBy({ username });
  }
}
