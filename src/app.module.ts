import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersModule } from './admin/users/users.module';
import { AuthModule } from './admin/auth/auth.module';
import { TasksModule } from './admin/tasks/tasks.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Jqka123456',
      database: 'midterm-nestjs',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
