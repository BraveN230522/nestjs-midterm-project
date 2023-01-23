import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator, RolesGuard, UserDecorator } from '../../common';
import { Role } from '../../enums';
import { Status } from '../entities/Statuses.entity';
import { User } from '../entities/users.entity';
import { CreateStatusDto, GetStatusDto, UpdateStatusDto } from './dto/statuses.dto';
import { StatusesService } from './statuses.service';

@Controller('Statuses')
@UseGuards(AuthGuard(), RolesGuard)
export class StatusesController {
  constructor(private StatusesService: StatusesService) {}

  @Get()
  getStatuses(@Body() getStatusDto: GetStatusDto) {
    return this.StatusesService.getStatuses(getStatusDto);
  }

  @Post()
  @RoleDecorator(Role.USER)
  createStatus(
    @Body() createStatusDto: CreateStatusDto,
    @UserDecorator() user: User,
  ): Promise<Status> {
    return this.StatusesService.createStatus(createStatusDto, user);
  }

  @Patch('/:id')
  // @RoleDecorator(Role.ADMIN)
  updateProject(@Param('id') id, @Body() updateStatusDto: UpdateStatusDto): Promise<Status> {
    return this.StatusesService.updateStatus(id, updateStatusDto);
  }

  // @Delete('/:id')
  // deleteStatus(@Param('id') id): Promise<void> {
  //   return this.StatusesService.deleteStatus(id);
  // }

  // @Patch('/:id')
  // updateStatus(
  //   @Param('id') id,
  //   @Body() updateStatusDto: CreateStatusDto,
  // ): Promise<Status> {
  //   return this.StatusesService.updateStatus(id, updateStatusDto);
  // }
}
