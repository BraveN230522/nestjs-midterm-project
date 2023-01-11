import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersModule } from './admin/users/users.module';

@Module({
  imports: [
    UsersModule,
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
