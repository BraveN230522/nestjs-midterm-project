import { Module } from '@nestjs/common';
import { UsersModule } from './admin/users/users.module';

@Module({
  imports: [UsersModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
