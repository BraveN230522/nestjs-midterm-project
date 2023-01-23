import { Module } from '@nestjs/common';
import { AppConfigModule } from './configuration';
import { DatabaseModule } from './database';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrioritiesModule } from './modules/priorities/priorities.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { StatusesModule } from './modules/statuses/statuses.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TypesModule } from './modules/types/types.module';
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
    StatusesModule,
    PrioritiesModule,
    TypesModule,
  ],
})
export class AppModule {}
