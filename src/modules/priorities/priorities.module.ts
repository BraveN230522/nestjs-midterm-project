import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../../common';
import { Priority } from '../entities/Priorities.entity';
import { PrioritiesController } from './priorities.controller';
import { PrioritiesRepository } from './priorities.repository';
import { PrioritiesService } from './priorities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Priority]), PassportModule],
  controllers: [PrioritiesController],
  providers: [PrioritiesService, PrioritiesRepository],
  exports: [PrioritiesRepository],
})
export class PrioritiesModule {}
