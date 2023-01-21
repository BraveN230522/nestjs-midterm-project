import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../configuration';
import { ErrorHelper } from '../../helpers';
import { JwtPayload } from '../../interfaces';
import { AuthService } from '../../modules/auth/auth.service';
import { Admin } from '../../modules/entities/admin.entity';
import { User } from '../../modules/entities/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) {
    super({
      secretOrKey: appConfigService.accessTokenSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User | Admin> {
    const auth = await this.authService.validate(payload);
    if (!auth) ErrorHelper.UnauthorizedException();

    return auth;
  }
}
