import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Patch,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Admin } from '../entities/admin.entity';
import { User } from '../entities/users.entity';
import { AuthService } from './auth.service';
import { AdminCredentialsDto, RegisterUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private adminService: AuthService) {}

  @Post('/login-admin')
  loginAdmin(@Body() adminCredentialsDto: AdminCredentialsDto): Promise<Admin> {
    return this.adminService.loginAdmin(adminCredentialsDto);
  }

  @Post('/login-user')
  @UseInterceptors(ClassSerializerInterceptor)
  loginUser(
    @Body(new ValidationPipe({ transform: true })) adminCredentialsDto: AdminCredentialsDto,
  ): Promise<User> {
    return this.adminService.loginUser(adminCredentialsDto);
  }

  @Patch('/register/:uuid')
  registerUser(@Param('uuid') uuid, @Body() registerUserDto: RegisterUserDto): Promise<string> {
    return this.adminService.register(uuid, registerUserDto);
  }
}
