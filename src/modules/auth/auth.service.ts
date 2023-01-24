import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { Role, UserStatus } from '../../enums';
import { EncryptHelper, ErrorHelper } from '../../helpers';
import { APP_MESSAGE } from '../../messages';
import { assignIfHasKey, matchWord } from '../../utilities';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../entities/admin.entity';
import { User } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { UsersRepository } from './../users/users.repository';
import { RegisterUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
    private userService: UsersService,
    private usersRepository: UsersRepository,
  ) {}

  async loginAdmin({ username, password }): Promise<Admin> {
    const found = await this.adminService.getAdminByUsername({ username });

    const match =
      (await bcrypt.compare(password || '', found?.password || '')) && username === found?.username;

    if (!match) ErrorHelper.UnauthorizedException(`Username or password is incorrect`);

    const payload = { username, role: found.role };
    const accessToken = await this.jwtService.sign(payload);

    const mappingResponse = _.omit(found, ['password', 'role']);

    await this.adminService.updateAdmin(found.id, { token: accessToken });

    return {
      ...mappingResponse,
      token: 'Bearer ' + accessToken,
    };

    // return found;
  }

  async loginUser({ username, password }): Promise<User> {
    const found = await this.userService.getUserByUsername({ username });
    console.log({ found });
    const match =
      (await bcrypt.compare(password || '', found?.password || '')) && username === found?.username;

    if (!match) ErrorHelper.UnauthorizedException(`Username or password is incorrect`);
    if (!found.status) ErrorHelper.UnauthorizedException(`This user is inactive`);

    const payload = { username, role: found.role };
    const accessToken = await this.jwtService.sign(payload);

    await this.userService.updateUser(found.id, { token: accessToken });

    const mappingResponse = _.omit(found, ['password', 'role']);

    return {
      ...mappingResponse,
      token: 'Bearer ' + accessToken,
    };

    // return found;
  }

  async validate({ username, role }): Promise<User | Admin> {
    switch (role) {
      case Role.ADMIN:
        return await this.adminService.getAdminByUsername({ username });
      case Role.USER:
        return await this.userService.getUserByUsername({ username });

      default:
        break;
    }
  }

  async register(uuid, registerUserDto: RegisterUserDto): Promise<string> {
    const user = await this.userService.getUser(uuid);

    if (user.isRegistered) ErrorHelper.BadRequestException('User has been registered');

    try {
      const password = await EncryptHelper.hash(registerUserDto.password, 1);
      assignIfHasKey(user, { ...registerUserDto, password, isRegistered: true });

      await this.usersRepository.save([user]);

      return APP_MESSAGE.UPDATED_SUCCESSFULLY('user');
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail as string;
        const uniqueArr = ['name', 'username'];

        uniqueArr.forEach((item) => {
          if (matchWord(detail, item) !== null)
            ErrorHelper.ConflictException(`This ${item} already exists`);
        });
      } else ErrorHelper.InternalServerErrorException();
    }
  }
}
