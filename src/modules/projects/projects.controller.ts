import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { Role } from '../../enums';
import { IPaginationResponse } from '../../interfaces';
import { Project } from '../entities/projects.entity';
import { User } from '../entities/users.entity';
import {
  AddMembersDto,
  CreateProjectDto,
  GetProjectMembersDto,
  GetProjectsDto,
  RemoveMembersDto,
  UpdateProjectDto,
} from './dto/projects.dto';
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

  @Patch('/:id')
  // @RoleDecorator(Role.ADMIN)
  updateProject(@Param('id') id, @Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Delete('/:id')
  deleteProject(@Param('id') id): Promise<any> {
    return this.projectsService.deleteProject(id);
  }

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Get('/members/:id')
  getProjectMembers(
    @Param('id') id,
    @Body() getProjectMembersDto: GetProjectMembersDto,
  ): Promise<IPaginationResponse<User>> {
    return this.projectsService.getProjectMembers(id, getProjectMembersDto);
  }

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Patch('/members/:id')
  addMembers(@Body() addMembersDto: AddMembersDto, @Param('id') id): Promise<string> {
    return this.projectsService.addMembers(addMembersDto, id);
  }

  @RoleDecorator(Role.ADMIN, Role.USER)
  @Delete('/members/:id')
  removeMembers(@Body() removeMembersDto: RemoveMembersDto, @Param('id') id): Promise<string> {
    return this.projectsService.removeMembers(removeMembersDto, id);
  }
}
