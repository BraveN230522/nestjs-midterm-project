import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { JwtStrategy } from '../../common/jwt/jwt.strategy';
import { AppConfigModule, AppConfigService } from '../../configuration';
import { AdminModule } from '../admin/admin.module';
import { AdminService } from '../admin/admin.service';
import { Priority } from '../entities/priorities.entity';
import { Status } from '../entities/statuses.entity';
import { Type } from '../entities/types.entity';
import { PrioritiesRepository } from '../priorities/priorities.repository';
import { PrioritiesService } from '../priorities/priorities.service';
import { ProjectsModule } from '../projects/projects.module';
import { StatusesRepository } from '../statuses/statuses.repository';
import { StatusesService } from '../statuses/statuses.service';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { TypesRepository } from '../types/types.repository';
import { TypesService } from '../types/types.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Type, Priority, Status]),
    JwtModule.registerAsync({
      // secret: 'top',
      // signOptions: {
      //   expiresIn: 3600,
      // },
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.accessTokenSecret,
        signOptions: {
          expiresIn: configService.accessTokenExpires,
        },
      }),
      inject: [AppConfigService],
    }),
    // TypeOrmModule.forFeature([UsersRepository, AdminRepository]),
    UsersModule,
    AdminModule,
    TasksModule,
    ProjectsModule,
  ],
  providers: [
    AuthService,
    UsersService,
    AdminService,
    JwtStrategy,
    TasksService,
    PrioritiesService,
    PrioritiesRepository,
    StatusesService,
    StatusesRepository,
    TypesService,
    TypesRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
