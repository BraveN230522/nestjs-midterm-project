import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Body, Post } from '@nestjs/common/decorators';
import { RoleDecorator } from '../../common';
import { Role } from '../../enums';
import { CreateAdminDto } from './dto/admin.dto';
import { Admin } from './admin.entity';

// import { AdminGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post()
  // @RoleDecorator(Role.ADMIN)
  createUser(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.createAdmin(createAdminDto);
  }
}
