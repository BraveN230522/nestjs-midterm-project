import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator, RolesGuard } from '../../common';
import { Role } from '../../enums';
import { Status } from '../entities/Statuses.entity';
import { CreateStatusDto, UpdateStatusDto } from './dto/statuses.dto';
import { StatusesService } from './statuses.service';

@Controller('Statuses')
@UseGuards(AuthGuard(), RolesGuard)
export class StatusesController {
  constructor(private StatusesService: StatusesService) {}

  @Get()
  @RoleDecorator(Role.ADMIN)
  getStatuses(): Promise<Status[]> {
    return this.StatusesService.getStatuses();
  }

  @Post()
  @RoleDecorator(Role.ADMIN)
  createStatus(@Body() createStatusDto: CreateStatusDto): Promise<Status> {
    return this.StatusesService.createStatus(createStatusDto);
  }

  @Patch('/:id')
  @RoleDecorator(Role.ADMIN)
  updateProject(@Param('id') id, @Body() updateStatusDto: UpdateStatusDto): Promise<Status> {
    return this.StatusesService.updateStatus(id, updateStatusDto);
  }
}
