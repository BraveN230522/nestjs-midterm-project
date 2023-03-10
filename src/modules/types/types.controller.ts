import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator, RolesGuard, UserDecorator } from '../../common';
import { Role } from '../../enums';
import { Type } from '../entities/Types.entity';
import { User } from '../entities/users.entity';
import { CreateTypeDto, GetTypeDto, UpdateTypeDto } from './dto/types.dto';
import { TypesService } from './types.service';

@Controller('Types')
@UseGuards(AuthGuard(), RolesGuard)
export class TypesController {
  constructor(private TypesService: TypesService) {}

  @Get()
  @RoleDecorator(Role.ADMIN)
  getTypes(): Promise<Type[]> {
    return this.TypesService.getTypes();
  }

  @Post()
  @RoleDecorator(Role.ADMIN)
  createType(@Body() createTypeDto: CreateTypeDto): Promise<Type> {
    return this.TypesService.createType(createTypeDto);
  }

  @Patch('/:id')
  @RoleDecorator(Role.ADMIN)
  updateType(@Param('id') id, @Body() updateTypeDto: UpdateTypeDto): Promise<Type> {
    return this.TypesService.updateType(id, updateTypeDto);
  }
}
