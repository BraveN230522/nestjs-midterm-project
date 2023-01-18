import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../../enums';
import { ErrorHelper } from '../../helpers';
import { JwtPayload } from '../../interfaces';
import { Admin } from '../../modules/admin/admin.entity';
import { AdminRepository } from '../../modules/admin/admin.repository';
import { AuthService } from '../../modules/auth/auth.service';
import { User } from '../../modules/users/users.entity';
import { UsersRepository } from '../../modules/users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: 'top',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User | Admin> {
    const auth = await this.authService.validate(payload);
    if (!auth) ErrorHelper.UnauthorizedException();

    return auth;
  }
}
