import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { Role } from '../../enums';
import { Admin } from '../admin/admin.entity';
import { AdminService } from '../admin/admin.service';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
    private userService: UsersService,
  ) {}

  async loginAdmin({ username, password }): Promise<Admin> {
    // bcrypt.genSalt(1, function (err, salt) {
    //   bcrypt.hash('123', salt, function (err, hash) {
    //     console.log({ hash });
    //     // Store hash in your password DB.
    //   });
    // });
    // return;
    const found = await this.adminService.getAdminByUsername({ username });

    const match =
      (await bcrypt.compare(password || '', found?.password || '')) && username === found?.username;

    if (!match) throw new UnauthorizedException(`Username or password is incorrect`);

    const payload = { username, role: found.role };
    const accessToken = await this.jwtService.sign(payload);

    const mappingResponse = _.omit(found, ['password']);

    return {
      ...mappingResponse,
      token: 'Bearer ' + accessToken,
    };

    // return found;
  }

  async loginUser({ username, password }): Promise<User> {
    // bcrypt.genSalt(1, function (err, salt) {
    //   bcrypt.hash('123', salt, function (err, hash) {
    //     console.log({ hash });
    //     // Store hash in your password DB.
    //   });
    // });
    // return;
    const found = await this.userService.getUserByUsername({ username });

    const match =
      (await bcrypt.compare(password || '', found?.password || '')) && username === found?.username;

    if (!match) throw new UnauthorizedException(`Username or password is incorrect`);

    const payload = { username, role: found.role };
    const accessToken = await this.jwtService.sign(payload);

    const mappingResponse = _.omit(found, ['password']);

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
}
