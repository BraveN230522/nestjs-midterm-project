import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { Auth } from './auth.entity';
import bcrypt from 'bcrypt';
import { EntityNotFoundError } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository) private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async login({ username, password }): Promise<Auth> {
    // bcrypt.genSalt(1, function (err, salt) {
    //   bcrypt.hash('123', salt, function (err, hash) {
    //     console.log({ hash });
    //     // Store hash in your password DB.
    //   });
    // });
    // return;
    const found = await this.authRepository.findOneBy({ username });

    const match =
      (await bcrypt.compare(password || '', found?.password || '')) &&
      username === found?.username;

    if (!match)
      throw new UnauthorizedException(`Username or password is incorrect`);

    const payload = { username };
    const accessToken = await this.jwtService.sign(payload);

    const mappingResponse = _.omit(found, ['password']);

    return {
      ...mappingResponse,
      token: accessToken,
    };

    return found;
  }
}
