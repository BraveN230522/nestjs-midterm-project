import { Controller } from '@nestjs/common';
import { Body, Get, Post, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator, RolesGuard, UserDecorator } from '../../common';
import { Role } from '../../enums';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(AuthGuard(), RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post()
  // @RoleDecorator(Role.ADMIN)
  createUser(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get('/me')
  @RoleDecorator(Role.ADMIN)
  getCurrentUser(@UserDecorator() user): Promise<Admin> {
    return this.adminService.getCurrentAdmin(user);
  }
}
