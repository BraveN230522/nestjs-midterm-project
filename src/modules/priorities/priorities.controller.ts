import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator, RolesGuard, UserDecorator } from '../../common';
import { Role } from '../../enums';
import { Priority } from '../entities/Priorities.entity';
import { User } from '../entities/users.entity';
import { CreatePriorityDto, GetPriorityDto, UpdatePriorityDto } from './dto/priorities.dto';
import { PrioritiesService } from './priorities.service';

@Controller('Priorities')
@UseGuards(AuthGuard(), RolesGuard)
export class PrioritiesController {
  constructor(private PrioritiesService: PrioritiesService) {}

  @Get()
  getPriorities(): Promise<Priority[]> {
    return this.PrioritiesService.getPriorities();
  }

  @Post()
  @RoleDecorator(Role.USER)
  createPriority(@Body() createPriorityDto: CreatePriorityDto): Promise<Priority> {
    return this.PrioritiesService.createPriority(createPriorityDto);
  }

  @Patch('/:id')
  // @RoleDecorator(Role.ADMIN)
  updateProject(@Param('id') id, @Body() updatePriorityDto: UpdatePriorityDto): Promise<Priority> {
    return this.PrioritiesService.updatePriority(id, updatePriorityDto);
  }

  // @Delete('/:id')
  // deletePriority(@Param('id') id): Promise<void> {
  //   return this.PrioritiesService.deletePriority(id);
  // }

  // @Patch('/:id')
  // updatePriority(
  //   @Param('id') id,
  //   @Body() updatePriorityDto: CreatePriorityDto,
  // ): Promise<Priority> {
  //   return this.PrioritiesService.updatePriority(id, updatePriorityDto);
  // }
}
