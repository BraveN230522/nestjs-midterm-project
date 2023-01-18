import { Module } from '@nestjs/common';
import { AppConfigModule } from './configuration';
import { DatabaseModule } from './database';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AppConfigModule,
    TasksModule,
    UsersModule,
    AdminModule,
    AuthModule,
    ProjectsModule,
  ],
})
export class AppModule {}
