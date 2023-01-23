import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Type } from '../entities/Types.entity';
import { TypesController } from './types.controller';
import { TypesRepository } from './types.repository';
import { TypesService } from './types.service';

@Module({
  imports: [TypeOrmModule.forFeature([Type]), PassportModule],
  controllers: [TypesController],
  providers: [TypesService, TypesRepository],
  exports: [TypesRepository],
})
export class TypesModule {}
