import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get baseUrlPrefix(): string {
    return this.configService.get('app.baseUrlPrefix');
  }

  get accessTokenSecret(): string {
    return this.configService.get('accessToken.secret');
  }

  get accessTokenExpires(): string {
    return this.configService.get('accessToken.expiresIn');
  }

  get accessTokenRememberMe(): string {
    return this.configService.get('accessToken.rememberMeIn');
  }

  get temporaryTokenSecret(): string {
    return this.configService.get('temporaryToken.secret');
  }

  get temporaryTokenExpires(): string {
    return this.configService.get('temporaryToken.expiresIn');
  }
}
