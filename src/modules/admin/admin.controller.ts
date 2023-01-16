import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';

// import { AdminGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
}
