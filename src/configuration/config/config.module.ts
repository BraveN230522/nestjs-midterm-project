import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dev from '../dev';
import { envSchema } from '../envSchema';
import { AppConfigService } from './config.service';

const NestConfigModule = ConfigModule.forRoot({
  load: [dev],
  isGlobal: true,
  //ignoreEnvFile: true,
  validationSchema: envSchema,
});

@Global()
@Module({
  imports: [NestConfigModule],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
