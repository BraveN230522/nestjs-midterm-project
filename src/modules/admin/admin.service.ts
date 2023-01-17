import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { ErrorHelper } from '../../helpers';
import { assignIfHasKey } from '../../utilities';
import { Admin } from './admin.entity';
import { AdminRepository } from './admin.repository';
import { UpdateAdminDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(AdminRepository) private adminRepository: AdminRepository) {}

  async getAdmin(id): Promise<Admin> {
    const found = await this.adminRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`User ${id} is not found`);

    return found;
  }

  async getAdminByUsername({ username }): Promise<Admin> {
    return await this.adminRepository.findOneBy({ username });
  }

  async createAdmin(CreateAdminDto): Promise<Admin> {
    try {
      const { name, status, username, password } = CreateAdminDto;
      const salt = bcrypt.genSaltSync(1);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // const auth = this.authRepository.create({
      //   username,
      //   password: hashedPassword,
      // });

      const user = this.adminRepository.create({
        username,
        password: hashedPassword,
        // auth: auth,
      });

      // console.log({ user, auth });

      // await this.authRepository.save(auth);
      await this.adminRepository.save([user]);

      return user;
    } catch (error) {
      console.log({ error });
      if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
      else ErrorHelper.InternalServerErrorException();
    }
  }

  async updateAdmin(id, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.getAdmin(id);
    assignIfHasKey(admin, updateAdminDto);

    await this.adminRepository.save([admin]);

    return admin;
  }

  async getCurrentAdmin(currentAdmin): Promise<Admin> {
    return currentAdmin;
  }
}
