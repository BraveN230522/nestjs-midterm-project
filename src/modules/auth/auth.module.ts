import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '../../common';
import { JwtStrategy } from '../../common/jwt/jwt.strategy';
import { AdminModule } from '../admin/admin.module';
import { AdminService } from '../admin/admin.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'top',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    // TypeOrmModule.forFeature([UsersRepository, AdminRepository]),
    UsersModule,
    AdminModule,
  ],
  providers: [AuthService, UsersService, AdminService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
