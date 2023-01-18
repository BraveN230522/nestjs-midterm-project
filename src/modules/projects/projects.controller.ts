import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { Role } from '../../enums';
import { IPaginationResponse } from '../../interfaces';
import { User } from './../users/users.entity';
import { CreateProjectDto, GetProjectsDto } from './dto/projects.dto';
import { Project } from './projects.entity';
import { ProjectsService } from './projects.service';

// import { CreateProjectDto, FilterProjectDto, ProjectProjectsDto } from './dto/projects.dto';

@Controller('projects')
@UseGuards(AuthGuard(), RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Get()
  getProjects(@Body() getProjectsDto: GetProjectsDto): Promise<IPaginationResponse<Project>> {
    return this.projectsService.getProjects(getProjectsDto);
  }

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Get('/:id')
  getProject(@Param('id') id): Promise<Project> {
    return this.projectsService.getProject(id);
  }

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Get('/members/:id')
  getProjectMembers(
    @Param('id') id,
    @Body() getProjectsDto: GetProjectsDto,
  ): Promise<IPaginationResponse<User>> {
    return this.projectsService.getProjectMembers(id, getProjectsDto);
  }

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Patch('/members/:id')
  addMembers(@Body('memberIds') ids): Promise<Project> {
    return this.projectsService.addMembers(ids);
  }
}
