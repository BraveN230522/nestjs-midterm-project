import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Status } from '../entities/Statuses.entity';
import { StatusesController } from './statuses.controller';
import { StatusesRepository } from './statuses.repository';
import { StatusesService } from './statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Status]), PassportModule],
  controllers: [StatusesController],
  providers: [StatusesService, StatusesRepository],
  exports: [StatusesRepository],
})
export class StatusesModule {}
