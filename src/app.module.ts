import { Module } from '@nestjs/common';
import { AppConfigModule } from './configuration';
import { DatabaseModule } from './database';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, AdminModule, AuthModule, DatabaseModule, AppConfigModule],
})
export class AppModule {}
